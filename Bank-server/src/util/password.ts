import CryptoJS from 'crypto-js'
import config from "../config"
export function decrypt(str:string) {
    const bytes = CryptoJS.AES.decrypt(str, config.contract_secret as string);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}