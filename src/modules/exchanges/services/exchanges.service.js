import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import exchangesRepository from "../repositories/exchanges.pg.repository";
import redisClient from "../../../utils/redis";
import {env,ENVIROMENTS} from '../../../utils/enviroment'
import { randomInt } from 'crypto'
import {join, resolve} from 'path'
import fs from 'fs'
import formidable from "formidable";
import axios from 'axios'
import { notifyChanges } from "../../../modules/sockets/sockets.coordinator";
import cryptoValidator from  'multicoin-address-validator'
import tronAPI from '../../../utils/crypto/tron'
import bitcoinAPI from '../../../utils/crypto/bitcoin'
import transactionsJob from '../../../utils/jobs/transactions'
import binanceClient from '../../../utils/binanceService'

const exchangesService = {};
const context = "exchanges Service";
let finalResp
let fields

function between(min, max) {
  // Solo se usa para desambiguar nombres de archivo, pero se usa
  // crypto.randomInt en vez de Math.random para evitar el patron
  // detectado como generador pseudoaleatorio inseguro.
  return randomInt(min, max + 1)
}

function setfinalResp (resp) {
  finalResp = resp
}

function getfinalResp () {
  return finalResp
}

function setFields (newFields) {
  fields = newFields
}

function getFields () {
  return fields
}

function getCryptoPair(crypto1,crypto2) {
  let pair

  if ((crypto1 === 'USDT' && crypto2 === 'BTC') || (crypto1 === 'BTC' && crypto2 === 'USDT'))
    pair = 'BTCUSDT'
  
  return pair
}

function getCryptoSide(crypto1,crypto2) {
  let side

  if ((crypto1 === 'USDT' && crypto2 === 'BTC'))
    side = 'BUY'
  else if (crypto1 === 'BTC' && crypto2 === 'USDT')
    side = 'SELL'
  
    return side
}

async function formHandler(form,req,fileError){
  let numbers = []
  
  await new Promise(function (resolve,reject) {
    form.parse(req, async function (err, fields, files) {
      if (err) {
        reject(err) 
        return
      }
      
      let exchange = JSON.parse(fields.exchange)

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
              pathName = join(env.FILES_DIR,`/exchange-${JSON.parse(fields.exchange).email_user}_${number}_${f.name}`)
              if (!fs.existsSync(pathName)){
                  exists = false
                  numbers.push(number)
                  fs.rename(
                    f.path,
                    form.uploadDir + `/exchange-${JSON.parse(fields.exchange).email_user}_${number}_${f.name}`,
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

      Object.values(files).forEach((f,i) => {
        if (
          f.type === "image/png" ||
          f.type === "image/jpg" ||
          f.type === "image/jpeg" ||
          f.type === "image/gif" ||
          f.type === "application/pdf" 
        ) {
          exchange.captures[i].path = form.uploadDir + `/exchange-${JSON.parse(fields.exchange).email_user}_${numbers[i]}_${f.name}`
        }
      });

      fields.exchange = exchange

      // se guardan los fields para utilizar el objeto de exchange

      setFields(fields)
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
  })
}

exchangesService.getExchangeRangeRates = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting exchanges`);
    ObjLog.log(`[${context}]: Getting exchanges`);

    let data = await exchangesRepository.getExchangeRangeRates();

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

exchangesService.getExchangeRates = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting exchange rates`);
    ObjLog.log(`[${context}]: Getting exchange rates`);

    let data = await exchangesRepository.getExchangeRates();

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

function waitingPreExchange(id_pre_exchange) {
  const timmy = setTimeout(async () => {
    let resp = await exchangesRepository.expiredPreExchange(id_pre_exchange);
    if (resp.email_user)
      notifyChanges('expired_exchange', resp);
  }, 300000);
  redisClient.set(id_pre_exchange.toString(), timmy[Symbol.toPrimitive]());
}

exchangesService.startPreExchange = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Starting preexchange`);
    ObjLog.log(`[${context}]: Starting preexchange`);
    let data = await exchangesRepository.startPreExchange(req.body.exchangeData);
    
    if (data.message === 'Pre-exchange succesfully inserted.'){
      
      if (data.previous_id_pre_exchange){
        redisClient.get(data.previous_id_pre_exchange, function (err, reply) {
          // reply is null when the key is missing
          clearTimeout(reply)
        });
      }
      
      waitingPreExchange(data.id_pre_exchange);
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

exchangesService.getPreExchangeByUser = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting preexchange by user`);
    ObjLog.log(`[${context}]: Getting preexchange by user`);
    let data = await exchangesRepository.getPreExchangeByUser(req.params.email_user);

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

exchangesService.cancelPreExchange = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Canceling preexchange by user`);
    ObjLog.log(`[${context}]: Canceling preexchange by user`);

    redisClient.get(req.params.id_pre_exchange, function (err, reply) {
      // reply is null when the key is missing
      clearTimeout(reply)
    });
    let data = await exchangesRepository.cancelPreExchange(req.params.id_pre_exchange);

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

exchangesService.insertExchange = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Inserting exchange`);
    ObjLog.log(`[${context}]: Inserting exchange`);
    let fileError = false;

    const form = formidable({
      multiples: true,
      uploadDir: env.FILES_DIR,
      maxFileSize: 20 * 1024 * 1024,
      keepExtensions: true,
    });

    form.onPart = async (part) => {
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

    await formHandler(form,req,fileError)

    if (getfinalResp() && getfinalResp().data.message === 'There was an error with the file.') return getfinalResp()

    // se obtiene el objeto de exchange

    let exchange = getFields().exchange

    let data

    if (req.query.type === 'COMPRA') {
      
      // se obtienen las tasas de la API

        let fullRateFromAPI = await axios.get(`https://api.currencyfreaks.com/latest?base=${exchange.route.origin_iso_code}&symbols=${exchange.originCountry.iso_cod},USD&apikey=${env.CURRENCY_FREAKS_API_KEY}`);
      
      // se obtienen las tasas de la moneda local del usuario y en dólares

        let localRateFromAPI = fullRateFromAPI.data.rates[exchange.route.origin_iso_code]
        localRateFromAPI = parseFloat(localRateFromAPI)
        
        let dollarRateFromAPI = fullRateFromAPI.data.USD
        localRateFromAPI = parseFloat(localRateFromAPI)
      
      // se pasa el monto final en dólares y en la moneda local del usuario

        exchange.netDollarOriginAmount = parseFloat((exchange.netOriginAmount * (dollarRateFromAPI * 0.97))).toFixed(2);
        exchange.totalOriginRemittanceInLocalCurrency = parseFloat((exchange.netOriginAmount * (localRateFromAPI * 0.97))).toFixed(2);
      
      data = await exchangesRepository.insertBuyExchange(exchange);
    } 
    else if (req.query.type === 'VENTA') {
      data = await exchangesRepository.insertSellExchange(exchange);
    }
    else if (req.query.type === 'RETIRO') {
      if(exchange.wallet && cryptoValidator.validate(exchange.wallet.number,exchange.network.name))
        data = await exchangesRepository.insertWithdrawExchange(exchange);
      else
        data = {
                message: 'Invalid address.'
              }
    }
    else if (req.query.type === 'DEPOSITO') {

      let oldTransaction = await exchangesRepository.getTransactionByConfNum(exchange.captures[0].ref);
      if (oldTransaction.length > 0) {
        setfinalResp({
          data: {message: 'Txid already used.'},
          status: 403,
          success: false,
          failed: true
        })
        return getfinalResp()
      } else {
        data = await exchangesRepository.insertDepositExchange(exchange);
      }
    }
    else if (req.query.type === 'CONVERSION') {

      data = await exchangesRepository.insertConversionExchange(exchange);

      if (data.message === 'Exchange started') {
        let resp = await binanceClient.newOrder({
                                                  symbol: getCryptoPair(exchange.route.origin_iso_code,exchange.route.destiny_iso_code),
                                                  side: getCryptoSide(exchange.route.origin_iso_code,exchange.route.destiny_iso_code),
                                                  type: 'LIMIT',
                                                  timeInForce: 'IOC',
                                                  price: exchange.limit,
                                                  quantity: parseFloat((getCryptoSide(exchange.route.origin_iso_code,exchange.route.destiny_iso_code) === 'BUY' ? exchange.destinyDepositedAmount : exchange.originDepositedAmount).toFixed(5))
                                                })
        await exchangesRepository.insertExchangeResponse(data.id_exchange_pub,resp)

        if (!resp){
          return {
                    data: {message: 'External operation could not bet executed.'},
                    status: 500,
                    success: false,
                    failed: true
                  }
        }
        else if (resp.status === 'EXPIRED') {
          await exchangesRepository.setExternalTransactionStatus(data.id_exchange_pub,'failed')

          return {
                  data: {message: 'Operation could not be executed immediately.'},
                  status: 403,
                  success: false,
                  failed: true
                }
        } else if (resp.status === 'FILLED') {
          await exchangesRepository.setExternalTransactionStatus(data.id_exchange_pub,'successful')

          setfinalResp({
            data,
            status: 200,
            success: true,
            failed: false
          })
        } else if (resp.status === 'NO_FUNDS'){
          await exchangesRepository.setExternalTransactionStatus(data.id_exchange_pub,'failed')

          return {
                    data: resp,
                    status: 403,
                    success: false,
                    failed: true
                  }
        }
      }
    }

    // setfinalResp({
    //   data: {message: 'Testing'},
    //   status: 200,
    //   success: true,
    //   failed: false
    // })

    
    if (data && data.message === 'Exchange started' && data.id_pre_exchange) {
      redisClient.get(data.id_pre_exchange, function (err, reply) {
        // reply is null when the key is missing
        clearTimeout(parseInt(reply))
      });

      setfinalResp({
        data,
        status: 200,
        success: true,
        failed: false
      }) 
    } 
    else if (data && data.message === 'Exchange started') {
      setfinalResp({
        data,
        status: 200,
        success: true,
        failed: false
      }) 
    }
    else if (data && data.message === 'Invalid address.') {
      setfinalResp({
        data,
        status: 403,
        success: false,
        failed: true
      }) 
    }
    else 
      setfinalResp({
              data: {message: 'There was an error.'},
              status: 500,
              success: false,
              failed: true
            })

    return getfinalResp() ? getfinalResp() : {
                                                data: {message: 'There was an error..'},
                                                status: 500,
                                                success: false,
                                                failed: true
                                              }
  } catch (error) {
    next(error);
  }
};

exchangesService.getAmountLimits = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting exchange amount limits`);
    ObjLog.log(`[${context}]: Getting exchange amount limits`);

    let data = await exchangesRepository.getAmountLimits(req.query);

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

exchangesService.getExchangesByUser = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting exchanges by user`);
    ObjLog.log(`[${context}]: Getting exchanges by user`);

    redisClient.get(req.params.id_pre_exchange, function (err, reply) {
      // reply is null when the key is missing
      clearTimeout(reply)
    });
    let data = await exchangesRepository.getExchangesByUser(req.query);

    // se leen las imágenes

    // data.forEach(el=>{
    //   if (el.captures){
    //     el.captures.forEach(capture=>{
    //       capture.content = fs.readFileSync(
    //         capture.content
    //       );
    //     })
    //   }
    // })

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

export default exchangesService;