var express = require('express');
var router = express.Router();
const {
  login,
  regist,
  changeUsername,
  changePassword
} = require('../controller/user');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const { genJwt } = require('../utils/jwt');
/* 登录 */
router.post('/login', function (req, res, next) {
  let { username, password } = req.body;

  const result = login(username, password);
  return result
    .then((loginData) => {
      if (loginData.username) {
        res.json(
          new SuccessModel({
            uid: loginData.uid,
            token: genJwt(loginData.username, loginData.uid),
            username: loginData.username
          })
        );
      } else {
        res.json(new ErrorModel('密码错误或用户不存在'));
      }
    })
    .catch(() => {
      res.json(new ErrorModel('登录失败'));
    });
});

// 注册
router.post('/regist', function (req, res, next) {
  let { username, password } = req.body;
  const result = regist(username, password);

  return result
    .then((registRes) => {
      if (registRes.success) {
        res.json(
          new SuccessModel({
            uid: registRes.uid,
            token: genJwt(registRes.username, registRes.uid),
            username: registRes.username
          })
        );
      } else {
        res.json(new ErrorModel(registRes.message));
      }
    })
    .catch(() => {
      res.json(new ErrorModel('注册失败'));
    });
});

/* 修改密码 */
router.post('/changePassword', loginCheck, function (req, res, next) {
  const { oldPassword, newPassword } = req.body;
  const uid = req.headers.tokenUid;

  const result = changePassword(oldPassword, newPassword, uid);
  return result
    .then((changePasswordRes) => {
      if (changePasswordRes.success) {
        res.json(new SuccessModel(changePasswordRes.message));
      } else {
        res.json(new ErrorModel(changePasswordRes.message));
      }
    })
    .catch(() => {
      res.json(new ErrorModel('密码修改失败'));
    });
});

/* 修改用户名 */
router.post('/changeUsername', loginCheck, function (req, res, next) {
  const { oldUsername, newUsername } = req.body;
  const uid = req.headers.tokenUid;

  const result = changeUsername(oldUsername, newUsername, uid);

  return result
    .then((changeNameRes) => {
      if (changeNameRes.success) {
        res.json({
          errno: 0,
          message: changeNameRes.message,
          newUsername: changeNameRes.newUsername
        });
      } else {
        res.json(new ErrorModel(changeNameRes.message));
      }
    })
    .catch((e) => {
      res.json(new ErrorModel('修改用户名失败'));
    });
});

module.exports = router;
