var express = require('express');
var router = express.Router();
const { login, regist } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

/* 登录 */
router.post('/login', function (req, res, next) {
  let { username, password } = req.body;

  const result = login(username, password);
  return result.then((loginData) => {
    if (loginData.username) {
      res.json(
        new SuccessModel({
          username: loginData.username,
          uid: loginData.uid
        })
      );
    } else {
      res.json(new ErrorModel('密码错误或用户不存在'));
    }
  });
});

/* 修改密码 */
router.post('/changePassword', function (req, res, next) {
  const { username, password } = req.body;

  res.json({
    errno: 0,
    text: `user:${username} changePassword to ${password}`
  });
});

// 注册
router.post('/regist', function (req, res, next) {
  let { username, password } = req.body;
  const result = regist(username, password);

  result.then((registRes) => {
    if (registRes.success) {
      res.json(new SuccessModel({ uid: registRes.uid }));
    } else {
      res.json(new ErrorModel(registRes.message));
    }
  });
});

module.exports = router;
