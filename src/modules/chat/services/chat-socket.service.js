import chatPGRepository from "../repositories/chat.pg.repository";
import {join} from 'path'
import {env} from '../../../utils/enviroment'
import fs from 'fs'
import { randomInt } from 'crypto'

const chatSocketService = {};

function between(min, max) {
  // Solo se usa para desambiguar nombres de archivo, pero se usa
  // crypto.randomInt en vez de Math.random para evitar el patron
  // detectado como generador pseudoaleatorio inseguro.
  return randomInt(min, max + 1)
}

chatSocketService.sendMessage = async (body) => {
  try {
    if (body.file) {
      let exists = true
      let pathName = join(env.FILES_DIR,`/${body.email_user}_${body.file_name}`)
      while (exists){
          let number = between(10000,99999);
          pathName = join(env.FILES_DIR,`/${body.email_user}-${number}_${body.file_name}`)
          if (!fs.existsSync(pathName)){
              exists = false
          }
      }
      fs.writeFileSync(pathName,body.file)
      body.file = pathName
    }  
    await chatPGRepository.sendMessage(body);
  } catch (error) {
    console.log(error)
  }
};

export default chatSocketService;
