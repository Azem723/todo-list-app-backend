const jwt = require('jsonwebtoken');



// jwt 签发
function genJwt(username, uid) {
  const tokenor = {
    username: username,
    uid: uid
  };
  // 过期时间 3天
  const token = jwt.sign(tokenor, key, {
    expiresIn: '3d',
    mutatePayload: true
  });
  return token;
}

// jwt 验证
function verifyJwt(headerToken) {
  if (!headerToken) {
    return false;
  }
  const userToken = headerToken.slice(7, headerToken.length);
  return jwt.verify(userToken, key, function (err, decode) {
    if (err) {
      return false;
    } else {
      return decode;
    }
  });
}

module.exports = {
  genJwt,
  verifyJwt
};
