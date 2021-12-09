var express = require('express');
var router = express.Router();
const {
  getList,
  addTodo,
  delTodo,
  updateTodo,
  reroderTodo,
  completeTodo,
  dailyTodo
} = require('../controller/todolist');
const { SuccessModel, ErrorModel } = require('../model/resModel');

/* 获取todolist */
router.get('/getTodolist', function (req, res, next) {
  const authorid = req.headers.authorid;

  const result = getList(authorid);
  return result.then((todoListData) => {
    res.json(new SuccessModel(todoListData));
  });
});

// 添加新的 todo
router.post('/addTodo', function (req, res, next) {
  const newTodo = req.body;
  const result = addTodo(newTodo);

  return result.then((data) => {
    if (data) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel('添加失败'));
    }
  });
});

// 删除todo
router.post('/delTodo', function (req, res, next) {
  const { delTodoId, authorId } = req.body;
  const result = delTodo(delTodoId, authorId);
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel('删除成功'));
    } else {
      res.json(new ErrorModel('删除失败'));
    }
  });
});

// 更新todo
router.put('/updateTodo', function (req, res, next) {
  const { id, text, authorId } = req.body;

  const result = updateTodo(id, text, authorId);
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel('更新成功'));
    } else {
      res.json(new ErrorModel('更新失败'));
    }
  });
});

// 重排序
router.post('/reorderTodo', function (req, res, next) {
  const { reorder, authorId } = req.body;
  const result = reroderTodo(reorder, authorId);
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel('重排成功'));
    } else {
      res.json(new ErrorModel('重排失败'));
    }
  });
});

// 完成 todo
router.put('/completeTodo', function (req, res, next) {
  const { completeTodoId, authorId } = req.body;
  const result = completeTodo(completeTodoId, authorId);
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel('状态更新失败'));
    }
  });
});

// 切换 todo 是否是日常
router.put('/dailyTodo', function (req, res, next) {
  const { dailyTodoId, authorId } = req.body;
  const result = dailyTodo(dailyTodoId, authorId);
  result.then((data) => {
    if (data) {
      res.json(new SuccessModel());
    } else {
      res.json(new ErrorModel('设置日常失败'));
    }
  });
});

module.exports = router;
