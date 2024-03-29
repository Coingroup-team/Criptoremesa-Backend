import { logger } from "../../../utils/logger";
import ObjLog from "../../../utils/ObjLog";
import countriesRepository from "../repositories/countries.pg.repository";
import authenticationPGRepository from "../../authentication/repositories/authentication.pg.repository";
import { env, ENVIROMENTS } from "../../../utils/enviroment";
const countriesService = {};
const context = "countries Service";

countriesService.getDestinyCountries = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting destiny Countries`);
    ObjLog.log(`[${context}]: Getting destiny Countries`);
    let data = await countriesRepository.getDestinyCountries();
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

countriesService.countriesCurrencies = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting countries currencies`);
    ObjLog.log(`[${context}]: Getting countries currencies`);

    let decodedValue = decodeURIComponent(req.query.email_user)

    let data = await countriesRepository.countriesCurrencies(
      decodedValue ? decodedValue : null,
      req.query.countriesType
    );
    return {
      data,
      status: 200,
      success: true,
      failed: false,
    };
  } catch (error) {
    next(error);
  }
};

countriesService.getCountriesByPayMethod = async (req, res, next) => {
  try {
    logger.info(`[${context}]: Getting Countries by pay method`);
    ObjLog.log(`[${context}]: Getting Countries by pay method`);

    let countryResp = null;
    let sess = null;
    let data = await countriesRepository.getCountriesByPayMethod(
      req.query.id_pay_method
    );
    const resp = authenticationPGRepository.getIpInfo(req.header("Client-Ip"));
    if (resp) countryResp = resp.country_name;
    if (await authenticationPGRepository.getSessionById(req.sessionID))
      sess = req.sessionID;

    const log = {
      is_auth: req.isAuthenticated(),
      success: true,
      failed: false,
      ip: req.header("Client-Ip"),
      country: countryResp,
      route: "/countries/getCountriesByPayMethod",
      session: sess,
    };
    authenticationPGRepository.insertLogMsg(log);

    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export default countriesService;