
import {SIDEBAR} from '@/config'
const CryptoJS = require('crypto-js')
 export function encrypt(str) {
    return CryptoJS.AES.encrypt(JSON.stringify(str), SIDEBAR.SECRET).toString();
}

/**
 * 解密函数
 * @param {*} str 
 */
export function decrypt(str) {
    const bytes = CryptoJS.AES.decrypt(str, SIDEBAR.SECRET);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}