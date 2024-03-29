import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import wholesale_partnersRepository from "../repositories/wholesale_partners.pg.repository";

const wholesale_partnersService = {};
const context = "wholesale_partners Service";

wholesale_partnersService.insertWholesalePartnerInfo = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Inserting wholesale_partner`);
    ObjLog.log(`[${context}]: Inserting wholesale_partner`);
    req.body.logo = req.file.path
    req.body.email_user = req.params.email_user
    let data = await wholesale_partnersRepository.insertWholesalePartnerInfo(req.body);

    let finalResp 

    if (data.message === 'Wholesale partner information successfuly inserted.')
      finalResp = {
                    data,
                    status: 200,
                    success: true,
                    failed: false
                  }
    else if (data.message === 'Error inserting wholesale partner information.')
      finalResp = {
        data,
        status: 403,
        success: false,
        failed: true
      }  
    return finalResp
  } catch (error) {
    next(error);
  }
};

wholesale_partnersService.getWholesalePartnerInfo = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting wholesale_partner`);
    ObjLog.log(`[${context}]: Getting wholesale_partner`);

    let data = await wholesale_partnersRepository.getWholesalePartnerInfo(req.params.slug);

    let finalResp 
    finalResp = {
                  data,
                  status: 200,
                  success: true,
                  failed: false
                }

    return finalResp
  } catch (error) {
    next(error);
  }
};

wholesale_partnersService.getWholesalePartnerRates = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting wholesale_partner rates`);
    ObjLog.log(`[${context}]: Getting wholesale_partner rates`);

    let data = await wholesale_partnersRepository.getWholesalePartnerRates(req.params.slug);

    let finalResp 
    finalResp = {
                  data,
                  status: 200,
                  success: true,
                  failed: false
                }

    return finalResp
  } catch (error) {
    next(error);
  }
};

wholesale_partnersService.getWholesalePartnerClients = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting wholesale_partner clients`);
    ObjLog.log(`[${context}]: Getting wholesale_partner clients`);

    let data = await wholesale_partnersRepository.getWholesalePartnerClients(req.params.slug,req.query.full);

    let finalResp 
    finalResp = {
                  data,
                  status: 200,
                  success: true,
                  failed: false
                }

    return finalResp
  } catch (error) {
    next(error);
  }
};

wholesale_partnersService.getWholesalePartnerClientRemittances = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting wholesale_partner clients remittances`);
    ObjLog.log(`[${context}]: Getting wholesale_partner clients remittances`);

    let data = await wholesale_partnersRepository.getWholesalePartnerClientRemittances(req.params.slug,req.query.full);

    let finalResp 
    finalResp = {
                  data,
                  status: 200,
                  success: true,
                  failed: false
                }

    return finalResp
  } catch (error) {
    next(error);
  }
};

wholesale_partnersService.changeWholesalePartnerPercentProfit = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Changing wholesale_partner percent profit`);
    ObjLog.log(`[${context}]: Changing wholesale_partner percent profit`);

    let data = await wholesale_partnersRepository.changeWholesalePartnerPercentProfit(req.params.slug,req.body.percentProfit);

    let finalResp 
    finalResp = {
                  data,
                  status: 200,
                  success: true,
                  failed: false
                }

    return finalResp
  } catch (error) {
    next(error);
  }
};

export default wholesale_partnersService;