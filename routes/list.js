var express = require('express');
var router = express.Router();
const {
  getList,
  addTodo,
  delTodo,
  updateTodo,
  reroderTodo,
  completeTodo
} = require('../controller/todolist');
const loginCheck = require('../middleware/loginCheck');
const { SuccessModel, ErrorModel } = require('../model/resModel');

/* 获取todolist */
router.get('/getTodolist', loginCheck, function (req, res, next) {
  const uid = req.headers.uid;
  const result = getList(uid);
  return result
    .then((todoListData) => {
      res.json(new SuccessModel(todoListData));
    })
    .catch((e) => {
      res.json(new ErrorModel('未能从服务器获取信息'));
    });
});

// 添加新的 todo
router.post('/addTodo', loginCheck, function (req, res, next) {
  const newTodo = req.body;
  // const authorid = newTodo.authorId;
  const result = addTodo(newTodo);

  return result
    .then((data) => {
      if (data) {
        res.json(new SuccessModel());
      } else {
        res.json(new ErrorModel('添加失败'));
      }
    })
    .catch((e) => {
      res.json(new ErrorModel('添加失败'));
    });
});

// 删除todo
router.post('/delTodo', loginCheck, function (req, res, next) {
  const { delTodoId, uid } = req.body;
  const result = delTodo(delTodoId, uid);
  result
    .then((data) => {
      if (data) {
        res.json(new SuccessModel('删除成功'));
      } else {
        res.json(new ErrorModel('删除失败'));
      }
    })
    .catch((e) => {
      res.json(new ErrorModel('删除失败'));
    });
});

// 更新todo
router.put('/updateTodo', loginCheck, function (req, res, next) {
  const { id, text, uid } = req.body;

  const result = updateTodo(id, text, uid);
  result
    .then((data) => {
      if (data) {
        res.json(new SuccessModel('更新成功'));
      } else {
        res.json(new ErrorModel('更新失败'));
      }
    })
    .catch((e) => {
      res.json(new ErrorModel('更新失败'));
    });
});

// 重排序
router.post('/reorderTodo', loginCheck, function (req, res, next) {
  const { reorder, uid } = req.body;
  const result = reroderTodo(reorder, uid);
  result
    .then((data) => {
      if (data) {
        res.json(new SuccessModel('重排成功'));
      } else {
        res.json(new ErrorModel('重排失败'));
      }
    })
    .catch((e) => {
      res.json(new ErrorModel('重排失败'));
    });
});

// 完成 todo
router.put('/completeTodo', loginCheck, function (req, res, next) {
  const { completeTodoId, uid } = req.body;
  const result = completeTodo(completeTodoId, uid);
  result
    .then((data) => {
      if (data) {
        res.json(new SuccessModel());
      } else {
        res.json(new ErrorModel('状态更新失败'));
      }
    })
    .catch((e) => {
      res.json(new ErrorModel('状态更新失败'));
    });
});

module.exports = router;
