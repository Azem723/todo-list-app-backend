const { verifyJwt } = require('../utils/jwt');
const { TokenErrorModel } = require('../model/resModel');

// jwt 验证登录中间件
module.exports = (req, res, next) => {
  if (req.headers.authorization) {
    const tokenRes = verifyJwt(req.headers.authorization);
    if (tokenRes) {
      req.headers.tokenUid = tokenRes.uid;
      next();
      return;
    } else {
      // console.log('token 过期');
      res.json(new TokenErrorModel('请重新登录'));
      return;
    }
  } else {
    res.json(new TokenErrorModel('请重新登录'));
    return;
  }
};
