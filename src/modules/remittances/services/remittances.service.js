import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import remittancesPGRepository from "../repositories/remittances.pg.repository";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
import redisClient from "../../../utils/redis";
import { notifyChanges } from "../../../modules/sockets/sockets.coordinator";
import {join, resolve} from 'path'
import fs from 'fs'
import formidable from "formidable";
import axios from 'axios'
import transbankService from "../../transbank/services/transbank.service";

const remittancesService = {};
const context = "remittances Service";
let events = {};

function between(min, max) {  
  return Math.floor(
    Math.random() * (max - min + 1) + min
  )
}

function getFromRedis(key) {
  return new Promise((resolve, reject) => {
    redisClient.get(key, (err, reply) => {
      if (err) return reject(err);
      return resolve(reply);
    });
  });
}

remittancesService.notificationTypes = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting notification types`);
    ObjLog.log(`[${context}]: Getting notification types`);
    let data = await remittancesPGRepository.notificationTypes();

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.getRemittances = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting ${req.params.email_user} remittances`);
    ObjLog.log(`[${context}]: Getting ${req.params.email_user} remittances`);
    let data = await remittancesPGRepository.getRemittances(req.params.email_user);
    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.limitationsByCodPub = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting limitations by cod pub`);
    ObjLog.log(`[${context}]: Getting limitations by cod pub`);
    let data = await remittancesPGRepository.limitationsByCodPub(req.params.cust_cr_cod_pub);
    
    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

let finalResp
function setfinalResp (resp) {
  finalResp = resp
}

function getfinalResp () {
  return finalResp
}

let globalFields
function setglobalFields (resp) {
  globalFields = resp
}

function getglobalFields () {
  return globalFields
}

let globalReqResNext
function setglobalReqResNext (resp) {
  globalReqResNext = resp
}

function getglobalReqResNext () {
  return globalReqResNext
}

remittancesService.startRemittance = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Starting remittance`);
    ObjLog.log(`[${context}]: Starting remittance`);
    let fileError = false;
    console.log('1 startRemittance')
    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 20 * 1024 * 1024,
      keepExtensions: true,
    });
    console.log('2 startRemittance form',form)

    form.onPart = async (part) => {
      console.log('2.1 startRemittance')
      if (
        !fileError &&
        !(
          part.mime === "image/png" ||
          part.mime === "image/jpg" ||
          part.mime === "image/jpeg" ||
          part.mime === "image/gif" ||
          part.mime === "application/pdf" ||
          part.mime === null
        )
      ) {
        fileError = true;
        form.emit("error");
      } else {
        await form.handlePart(part);
      }
    };
    console.log('3 startRemittance')

    form.on("error", function (err) {
      if (fileError) {
        next({
          message: `Uno o varios archivos no tienen formato permitido`,
        });
      } else {
        fileError = true;

        next({
          message: `El archivo subido ha excedido el límite, vuelve a intentar con uno menor a ${form.maxFileSize} B`,
        });
      }
    });
    let numbers = []
    console.log('4 startRemittance')

    await new Promise((resolve,reject) => {
      try {  
        form.parse(req, async function (err, fields, files) {

          Object.values(files).forEach((f) => {
            if (
              f.type === "image/png" ||
              f.type === "image/jpg" ||
              f.type === "image/jpeg" ||
              f.type === "image/gif" ||
              f.type === "application/pdf" 
            ) {
    
              let exists = true
              let pathName
              while (exists){
                  let number = between(10000,99999);
                  pathName = join(env.FILES_DIR,`/remittance-${JSON.parse(fields.remittance).email_user}_${number}_${f.name}`)
                  if (!fs.existsSync(pathName)){
                      exists = false
                      numbers.push(number)
                      fs.rename(
                        f.path,
                        form.uploadDir + `/remittance-${JSON.parse(fields.remittance).email_user}_${number}_${f.name}`,
                        (error) => {
                          if (error) {
                            next(error);
                          }
                        }
                      );
                  }
              }
            }
          });
          if (!fileError) {
            let remittance = JSON.parse(fields.remittance)
    
            Object.values(files).forEach((f,i) => {
              if (
                f.type === "image/png" ||
                f.type === "image/jpg" ||
                f.type === "image/jpeg" ||
                f.type === "image/gif" ||
                f.type === "application/pdf" 
              ) {
                remittance.captures[i].path = form.uploadDir + `/remittance-${JSON.parse(fields.remittance).email_user}_${numbers[i]}_${f.name}`
              }
            });

            let fullRateFromAPI
            let infoForApi

            // se calcula la ganancia del AM en caso de haber

              if (remittance.rateValue.wholesale_partner_rate_factor) {
                remittance.totalWholesalePartnerOriginAmount = remittance.totalOriginRemittance
                if (remittance.rateValue.operation === 'mul')
                  remittance.totalOriginRemittance = remittance.totalDestinationRemittance / remittance.rateValue.rate_factor
                else if (remittance.rateValue.operation === 'div')
                  remittance.totalOriginRemittance = remittance.totalDestinationRemittance * remittance.rateValue.rate_factor
            
                  remittance.wholesalePartnerProfit = Math.abs(remittance.totalOriginRemittance - remittance.totalWholesalePartnerOriginAmount)

                  // se obtiene informacion necesaria para encontrar las tasas
        
                    infoForApi = await remittancesPGRepository.getInfoForRateApi(remittance.email_user);
                  // se obtienen las tasas de la API
        
                    fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${remittance.countryCurrency.isoCode}&symbols=${infoForApi.origin_currency_iso_code},${infoForApi.wholesale_partner_origin_currency_iso_code},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
              } else {
                // se obtiene informacion necesaria para encontrar las tasas
            
                  infoForApi = await remittancesPGRepository.getInfoForRateApi(remittance.email_user);
                // se obtienen las tasas de la API
      
                  fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${remittance.countryCurrency.isoCode}&symbols=${infoForApi.origin_currency_iso_code},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
              }

            // se obtienen las tasas de la moneda local del usuario y en dólares
        
              let localRateFromAPI = fullRateFromAPI.data.rates[infoForApi.origin_currency_iso_code]
              localRateFromAPI = parseFloat(localRateFromAPI)

              let WPRateFromAPI = fullRateFromAPI.data.rates[infoForApi.wholesale_partner_origin_currency_iso_code]
              WPRateFromAPI = parseFloat(WPRateFromAPI)
              
              let dollarRateFromAPI = fullRateFromAPI.data.rates.USD
              dollarRateFromAPI = parseFloat(dollarRateFromAPI)
              
            // se pasa el monto final y ganancia del AM en dólares, en la moneda local del usuario y la ganancia del AM
            
              remittance.totalDollarOriginRemittance = parseFloat((remittance.totalOriginRemittance * (dollarRateFromAPI * 0.97))).toFixed(2);
              remittance.totalOriginRemittanceInLocalCurrency = parseFloat(remittance.totalOriginRemittance * (localRateFromAPI)).toFixed(2);
              
              logger.silly(`remittance.totalDollarOriginRemittance: ${remittance.totalDollarOriginRemittance}`)
              logger.silly(`dollarRateFromAPI: ${dollarRateFromAPI}`)
              logger.silly(`localRateFromAPI: ${localRateFromAPI}`)
              logger.silly(`remittance.totalOriginRemittance: ${remittance.totalOriginRemittance}`)
              logger.silly(`remittance.totalOriginRemittanceInLocalCurrency: ${remittance.totalOriginRemittanceInLocalCurrency}`)

              if (remittance.rateValue.wholesale_partner_rate_factor) {
                remittance.wholesalePartnerProfitLocalCurrency = parseFloat((remittance.wholesalePartnerProfit * WPRateFromAPI)).toFixed(2);
                remittance.wholesalePartnerProfitDollar = parseFloat((remittance.wholesalePartnerProfit * dollarRateFromAPI)).toFixed(2);
              }
            // se inicia la remesa en bd
            
              let data = await remittancesPGRepository.startRemittance(remittance);
            
            // se detiene la preremesa si la hay

              if (data.message === 'Remittance started' && data.id_pre_remittance) {
                redisClient.get(data.id_pre_remittance, function (err, reply) {
                  // reply is null when the key is missing
                  clearTimeout(parseInt(reply))
                });
              }
        
            // se asigna la respuesta al FE

              setfinalResp({
                            data,
                            status: 200,
                            success: true,
                            failed: false
                          }) 
          } 
          else 
            setfinalResp({
              data: {message: 'There was an error with the file.'},
              status: 500,
              success: false,
              failed: true
            })
          resolve()
        });
      }
      catch {
        reject('There was an error with the file.');
      }
    })
      

      return getfinalResp() ? getfinalResp() : {
                                                  data: {message: 'There was an error.'},
                                                  status: 500,
                                                  success: false,
                                                  failed: true
                                                }
  } catch (error) {
    next(error);
  }
};

remittancesService.webpayRemittance = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Starting webpay remittance`);
    ObjLog.log(`[${context}]: Starting webpay remittance`);

    console.log('TOKEN',req.body)

    // se confirma la transaccion  

    let transbankRes = await transbankService.confirmWebpayTransactionNoEndpoint(req.body.token)

    console.log('TRANSBANK RES',transbankRes)

    if (transbankRes && transbankRes.status === 200) {

      let remittance = req.body.remittance

      let fullRateFromAPI
      let infoForApi

      // se calcula la ganancia del AM en caso de haber

        if (remittance.rateValue.wholesale_partner_rate_factor) {
          remittance.totalWholesalePartnerOriginAmount = remittance.totalOriginRemittance
          if (remittance.rateValue.operation === 'mul')
            remittance.totalOriginRemittance = remittance.totalDestinationRemittance / remittance.rateValue.rate_factor
          else if (remittance.rateValue.operation === 'div')
            remittance.totalOriginRemittance = remittance.totalDestinationRemittance * remittance.rateValue.rate_factor
      
            remittance.wholesalePartnerProfit = Math.abs(remittance.totalOriginRemittance - remittance.totalWholesalePartnerOriginAmount)

            // se obtiene informacion necesaria para encontrar las tasas

              infoForApi = await remittancesPGRepository.getInfoForRateApi(remittance.email_user);
            // se obtienen las tasas de la API

              fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${remittance.countryCurrency.isoCode}&symbols=${infoForApi.origin_currency_iso_code},${infoForApi.wholesale_partner_origin_currency_iso_code},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
        } else {
          console.log('7 startRemittance')
          // se obtiene informacion necesaria para encontrar las tasas
      
            infoForApi = await remittancesPGRepository.getInfoForRateApi(remittance.email_user);
          // se obtienen las tasas de la API

            fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${remittance.countryCurrency.isoCode}&symbols=${infoForApi.origin_currency_iso_code},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
        }
        console.log('8 startRemittance')
      // se obtienen las tasas de la moneda local del usuario y en dólares

        let localRateFromAPI = fullRateFromAPI.data.rates[infoForApi.origin_currency_iso_code]
        localRateFromAPI = parseFloat(localRateFromAPI)

        let WPRateFromAPI = fullRateFromAPI.data.rates[infoForApi.wholesale_partner_origin_currency_iso_code]
        WPRateFromAPI = parseFloat(WPRateFromAPI)
        
        let dollarRateFromAPI = fullRateFromAPI.data.rates.USD
        dollarRateFromAPI = parseFloat(dollarRateFromAPI)
        
        console.log('9 startRemittance')
      // se pasa el monto final y ganancia del AM en dólares, en la moneda local del usuario y la ganancia del AM
      
        remittance.totalDollarOriginRemittance = parseFloat((remittance.totalOriginRemittance * (dollarRateFromAPI * 0.97))).toFixed(2);
        remittance.totalOriginRemittanceInLocalCurrency = parseFloat(remittance.totalOriginRemittance * (localRateFromAPI)).toFixed(2);
        
        logger.silly(`remittance.totalDollarOriginRemittance: ${remittance.totalDollarOriginRemittance}`)
        logger.silly(`dollarRateFromAPI: ${dollarRateFromAPI}`)
        logger.silly(`localRateFromAPI: ${localRateFromAPI}`)
        logger.silly(`remittance.totalOriginRemittance: ${remittance.totalOriginRemittance}`)
        logger.silly(`remittance.totalOriginRemittanceInLocalCurrency: ${remittance.totalOriginRemittanceInLocalCurrency}`)

        if (remittance.rateValue.wholesale_partner_rate_factor) {
          remittance.wholesalePartnerProfitLocalCurrency = parseFloat((remittance.wholesalePartnerProfit * WPRateFromAPI)).toFixed(2);
          remittance.wholesalePartnerProfitDollar = parseFloat((remittance.wholesalePartnerProfit * dollarRateFromAPI)).toFixed(2);
        }

        // se inicia la remesa en bd
        console.log('REMITTANCE',remittance)
        let data = await remittancesPGRepository.startRemittance(remittance);

        // se asigna la respuesta al FE
      
        setfinalResp({
          data: {...data,transbankRes},
          status: 200,
          success: true,
          failed: false
        }) 
        
        // se detiene la preremesa si la hay
    
        if (data.message === 'Remittance started' && data.id_pre_remittance) {
          redisClient.get(data.id_pre_remittance, function (err, reply) {
            // reply is null when the key is missing
            clearTimeout(parseInt(reply))
          });
        }
    }
    else {
      setfinalResp({
        data: {message: 'Testing error', transbankRes},
        status: 403,
        success: true,
        failed: false
      })
    }

    return getfinalResp() ? getfinalResp() : {
                                                data: {message: 'There was an error.'},
                                                status: 500,
                                                success: false,
                                                failed: true
                                              }
  } catch (error) {
    next(error);
  }
};

function waitingPreRemittance(id_pre_remittance) {
  const timmy = setTimeout(async () => {
    let resp = await remittancesPGRepository.expiredPreRemittance(id_pre_remittance);
    if (resp.email_user)
      notifyChanges('expired_remittance', resp);
  }, 900000);
  redisClient.set(id_pre_remittance.toString(), timmy[Symbol.toPrimitive]());
}

remittancesService.startPreRemittance = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Starting preremittance`);
    ObjLog.log(`[${context}]: Starting preremittance`);
    let data = await remittancesPGRepository.startPreRemittance(req.body);
    
    if (data.message === 'Pre-remittance succesfully inserted.'){
      
      if (data.previous_id_pre_remittance){
        redisClient.get(data.previous_id_pre_remittance, function (err, reply) {
          // reply is null when the key is missing
          clearTimeout(reply)
        });
      }
      
      waitingPreRemittance(data.id_pre_remittance);
    }
      
    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.getPreRemittanceByUser = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting preremittance by user`);
    ObjLog.log(`[${context}]: Getting preremittance by user`);
    let data = await remittancesPGRepository.getPreRemittanceByUser(req.params.email_user);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.cancelPreRemittance = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Canceling preremittance by user`);
    ObjLog.log(`[${context}]: Canceling preremittance by user`);

    redisClient.get(req.params.id_pre_remittance, function (err, reply) {
      // reply is null when the key is missing
      clearTimeout(reply)
    });
    let data = await remittancesPGRepository.cancelPreRemittance(req.params.id_pre_remittance);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.lastRemittances = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting last remittances by user`);
    ObjLog.log(`[${context}]: Getting last remittances by user`);
    
    let data = await remittancesPGRepository.lastRemittances(req.params.email_user,req.query.limit,req.query.start_date,req.query.end_date,req.query.mode,req.query.only_wholesale_partner);

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.getMinAmounts = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting remittance's min amounts`);
    ObjLog.log(`[${context}]: Getting remittance's min amounts`);
    let data = await remittancesPGRepository.getMinAmounts();

    return {
      data,
      status: 200,
      success: true,
      failed: false
    }
  } catch (error) {
    next(error);
  }
};

remittancesService.tumipayRemittance = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Starting tumipay remittance`);
    ObjLog.log(`[${context}]: Starting tumipay remittance`);

    console.log('TOKEN',req.body)

    // se confirma la transaccion  

    let transbankRes = await transbankService.confirmWebpayTransactionNoEndpoint(req.body.token)

    console.log('TRANSBANK RES',transbankRes)

    if (transbankRes && transbankRes.status === 200) {

      let remittance = req.body.remittance

      let fullRateFromAPI
      let infoForApi

      // se calcula la ganancia del AM en caso de haber

        if (remittance.rateValue.wholesale_partner_rate_factor) {
          remittance.totalWholesalePartnerOriginAmount = remittance.totalOriginRemittance
          if (remittance.rateValue.operation === 'mul')
            remittance.totalOriginRemittance = remittance.totalDestinationRemittance / remittance.rateValue.rate_factor
          else if (remittance.rateValue.operation === 'div')
            remittance.totalOriginRemittance = remittance.totalDestinationRemittance * remittance.rateValue.rate_factor
      
            remittance.wholesalePartnerProfit = Math.abs(remittance.totalOriginRemittance - remittance.totalWholesalePartnerOriginAmount)

            // se obtiene informacion necesaria para encontrar las tasas

              infoForApi = await remittancesPGRepository.getInfoForRateApi(remittance.email_user);
            // se obtienen las tasas de la API

              fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${remittance.countryCurrency.isoCode}&symbols=${infoForApi.origin_currency_iso_code},${infoForApi.wholesale_partner_origin_currency_iso_code},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
        } else {
          console.log('7 startRemittance')
          // se obtiene informacion necesaria para encontrar las tasas
      
            infoForApi = await remittancesPGRepository.getInfoForRateApi(remittance.email_user);
          // se obtienen las tasas de la API

            fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${remittance.countryCurrency.isoCode}&symbols=${infoForApi.origin_currency_iso_code},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
        }
        console.log('8 startRemittance')
      // se obtienen las tasas de la moneda local del usuario y en dólares

        let localRateFromAPI = fullRateFromAPI.data.rates[infoForApi.origin_currency_iso_code]
        localRateFromAPI = parseFloat(localRateFromAPI)

        let WPRateFromAPI = fullRateFromAPI.data.rates[infoForApi.wholesale_partner_origin_currency_iso_code]
        WPRateFromAPI = parseFloat(WPRateFromAPI)
        
        let dollarRateFromAPI = fullRateFromAPI.data.rates.USD
        dollarRateFromAPI = parseFloat(dollarRateFromAPI)
        
        console.log('9 startRemittance')
      // se pasa el monto final y ganancia del AM en dólares, en la moneda local del usuario y la ganancia del AM
      
        remittance.totalDollarOriginRemittance = parseFloat((remittance.totalOriginRemittance * (dollarRateFromAPI * 0.97))).toFixed(2);
        remittance.totalOriginRemittanceInLocalCurrency = parseFloat(remittance.totalOriginRemittance * (localRateFromAPI)).toFixed(2);
        
        logger.silly(`remittance.totalDollarOriginRemittance: ${remittance.totalDollarOriginRemittance}`)
        logger.silly(`dollarRateFromAPI: ${dollarRateFromAPI}`)
        logger.silly(`localRateFromAPI: ${localRateFromAPI}`)
        logger.silly(`remittance.totalOriginRemittance: ${remittance.totalOriginRemittance}`)
        logger.silly(`remittance.totalOriginRemittanceInLocalCurrency: ${remittance.totalOriginRemittanceInLocalCurrency}`)

        if (remittance.rateValue.wholesale_partner_rate_factor) {
          remittance.wholesalePartnerProfitLocalCurrency = parseFloat((remittance.wholesalePartnerProfit * WPRateFromAPI)).toFixed(2);
          remittance.wholesalePartnerProfitDollar = parseFloat((remittance.wholesalePartnerProfit * dollarRateFromAPI)).toFixed(2);
        }

        // se inicia la remesa en bd
        console.log('REMITTANCE',remittance)
        let data = await remittancesPGRepository.startRemittance(remittance);

        // se asigna la respuesta al FE
      
        setfinalResp({
          data: {...data,transbankRes},
          status: 200,
          success: true,
          failed: false
        }) 
        
        // se detiene la preremesa si la hay
    
        if (data.message === 'Remittance started' && data.id_pre_remittance) {
          redisClient.get(data.id_pre_remittance, function (err, reply) {
            // reply is null when the key is missing
            clearTimeout(parseInt(reply))
          });
        }
    }
    else {
      setfinalResp({
        data: {message: 'Testing error', transbankRes},
        status: 403,
        success: true,
        failed: false
      })
    }

    return getfinalResp() ? getfinalResp() : {
                                                data: {message: 'There was an error.'},
                                                status: 500,
                                                success: false,
                                                failed: true
                                              }
  } catch (error) {
    next(error);
  }
};

remittancesService.getInfoByOriginAndDestination = async (countryIsoCodOrigin, countryIsoCodDestiny) => {
  logger.info(`[${context}]: Getting remittance info by origin and destination`);
  ObjLog.log(`[${context}]: Getting remittance info by origin and destination`);

  let data = await remittancesPGRepository.getInfoByOriginAndDestination(countryIsoCodOrigin, countryIsoCodDestiny);
  const pairInfo = countryIsoCodOrigin + countryIsoCodDestiny
  const redisInfo = await getFromRedis(pairInfo)

  if (redisInfo) {
    // redisClient.del(pairInfo);
    data = JSON.parse(redisInfo)
  } else {
    data =  await remittancesPGRepository.getInfoByOriginAndDestination(req.params.countryIsoCodOrigin, req.params.countryIsoCodDestiny);
    redisClient.set(pairInfo, JSON.stringify(data));
  }

  return {
    data,
    status: 200,
    success: true,
    failed: false
  }
}

export default remittancesService;
export { events };