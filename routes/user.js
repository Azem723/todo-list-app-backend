var express = require('express');
var router = express.Router();

/* 登录 */
router.post('/login', function (req, res, next) {
  const { username, password } = req.body;

  res.json({
    errno: 0,
    text: `user:${username} login`
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

module.exports = router;
