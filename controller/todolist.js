const xss = require('xss');
const { exec, escape } = require('../db/mysql');

/* 获取todolist */
const getList = (authorId) => {
  // escape 防止注入式攻击
  authorId = escape(authorId);
  // 根据 authorId 查询所有 Todos
  let sql = `select * from todolist where authorId=${authorId} `;
  // 在此处根据数据库的 sortIndex 进行排序，返回一个数组
  sql += 'order by sortIndex;';
  // 返回 Promise
  return exec(sql);
};

// 添加新的 todo
const addTodo = (newTodo) => {
  // 结构获得 newTodo 的所有属性
  let { id, text, isComplete, sortIndex, isDaily, authorId } = newTodo;
  // escape 防止注入式攻击
  id = escape(id);
  text = xss(escape(text));
  isComplete = escape(isComplete);
  sortIndex = escape(sortIndex);
  isDaily = escape(isDaily);
  authorId = escape(authorId);

  // insert 进入表 todolist、
  // mysql 中所有用户的 Todo 全部存储在表 todolist 中，根据 authorId 进行区分
  const sql = `
  insert into todolist (id,text,isComplete,sortIndex,isDaily,authorId)
  values (${id}, ${text}, ${isComplete}, ${sortIndex}, ${isDaily}, ${authorId});
  `;

  return exec(sql).then((addData) => {
    if (addData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

// 删除todo
const delTodo = (delTodoId, authorId) => {
  id = escape(delTodoId);
  authorId = escape(authorId);

  const sql = `delete from todolist where authorId=${authorId} and id=${id};`;
  return exec(sql).then((deleteData) => {
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

// 更新todo
const updateTodo = (id, text, authorId) => {
  id = escape(id);
  text = xss(escape(text));
  authorId = escape(authorId);

  // 更新时同时匹配 authorId 和 id
  const sql = `update todolist set text=${text} where authorId=${authorId} and id=${id};`;

  return exec(sql).then((updateData) => {
    if (updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};
// 重排序
const reroderTodo = (reorder, authorId) => {
  let sqlcode = '';
  let range = [];
  /**
   *  通过拼接字符串，使用 mysql 自带的 switch 语句进行批量更新
   * UPDATE todolist SET
   *   sortIndex = CASE id
   *     WHEN 4222 THEN 1
   *     WHEN 4212 THEN 2
   *     WHEN 7634 THEN 3
   *     WHEN 9101 THEN 4
   *   END
   * where id in (4222,4212,7634,9101) authorId=123
   */
  reorder.forEach((element) => {
    sqlcode += `WHEN ${escape(element.id)} THEN ${escape(element.sortIndex)}\n`;
    range.push(escape(element.id));
  });
  range = `(${range.toString()})`;
  const sql = `
    UPDATE todolist SET
      sortIndex = CASE id
        ${sqlcode}
      END
    where id in ${range} and authorId=${authorId}
  `;
  return exec(sql).then((reorderData) => {
    if (reorderData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

// 完成 todo
const completeTodo = (completeTodoId, authorId) => {
  completeTodoId = escape(completeTodoId);
  authorId = escape(authorId);
  sql = `update todolist set isComplete=abs(isComplete-1) where authorId=${authorId} and id=${completeTodoId};`;
  return exec(sql).then((completeData) => {
    if (completeData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

// 切换 todo 是否是日常
const dailyTodo = (dailyTodoId, authorId) => {
  dailyTodoId = escape(dailyTodoId);
  authorId = escape(authorId);
  sql = `update todolist set isDaily=abs(isDaily-1) where authorId=${authorId} and id=${dailyTodoId};`;
  return exec(sql).then((dailyData) => {
    if (dailyData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

module.exports = {
  getList,
  addTodo,
  delTodo,
  updateTodo,
  reroderTodo,
  completeTodo,
  dailyTodo
};
