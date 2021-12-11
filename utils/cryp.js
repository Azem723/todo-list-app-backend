const crypto = require('crypto');
const fs = require('fs');

// RSA 非对称加密
// 公钥
const publicKey = fs
  .readFileSync('./utils/rsa_public_key.pem')
  .toString('ascii');
const privateKey = fs
  .readFileSync('./utils/rsa_private_key.pem')
  .toString('ascii');

const publiCipher = {
  key: publicKey,
  padding: crypto.constants.RSA_PKCS1_PADDING
};
// crypto默认使用 OAEP 作为填充
// JSEncrypt仅支持 PKCS#1 v1.5 填充。
// 手动设置 padding
const privateCipher = {
  key: privateKey,
  padding: crypto.constants.RSA_PKCS1_PADDING
};

function encrypt(data) {
  const encodeData = crypto
    .publicEncrypt(publiCipher, Buffer.from(data, 'base64'))
    .toString('utf-8');
  return encodeData;
}

function decrypt(data) {
  const decodeData = crypto
    .privateDecrypt(privateCipher, Buffer.from(data, 'base64'))
    .toString('utf-8');
  // console.log(decodeData);
  return decodeData;
}

// 密匙
const SECRET_KEY = 'Arfoi_3658#';

// md5 加密
function md5(content) {
  let md5 = crypto.createHash('md5');
  return md5.update(content).digest('hex');
}

// 加密函数
function genPassword(password) {
  const str = `password=${password}&key=${SECRET_KEY}`;
  return md5(str);
}

module.exports = {
  encrypt,
  decrypt,
  genPassword
};
