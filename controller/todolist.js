const xss = require('xss');
const { exec, escape } = require('../db/mysql');

/* 获取todolist */
const getList = (uid) => {
  // escape 防止注入式攻击
  uid = escape(uid);
  // 根据 authorId 查询所有 Todos
  let sql = `select * from todolist where authorId=${uid} `;
  // 在此处根据数据库的 sortIndex 进行排序，返回一个数组
  sql += 'order by sortIndex;';
  // 返回 Promise
  return exec(sql)
    .then((todolistData) => {
      return todolistData;
    })
    .catch((err) => {
      // console.log(err);
      return {};
    });
};

// 添加新的 todo
const addTodo = (newTodo) => {
  // 结构获得 newTodo 的所有属性
  let { id, text, isComplete, sortIndex, isDaily, uid } = newTodo;
  // escape 防止注入式攻击
  id = escape(id);
  text = xss(escape(text));
  isComplete = escape(isComplete);
  sortIndex = escape(sortIndex);
  isDaily = escape(isDaily);
  uid = escape(uid);

  // insert 进入表 todolist、
  // mysql 中所有用户的 Todo 全部存储在表 todolist 中，根据 authorId 进行区分
  const sql = `
  insert into todolist (id,text,isComplete,sortIndex,isDaily,authorId)
  values (${id}, ${text}, ${isComplete}, ${sortIndex}, ${isDaily}, ${uid});
  `;

  return exec(sql).then((addData) => {
    if (addData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

// 删除todo
const delTodo = (delTodoId, uid) => {
  id = escape(delTodoId);
  uid = escape(uid);

  const sql = `delete from todolist where authorId=${uid} and id=${id};`;
  return exec(sql).then((deleteData) => {
    if (deleteData.affectedRows > 0) {
      return true;
    }
    return false;
  });
};

// 更新todo
const updateTodo = (id, text, uid) => {
  id = escape(id);
  text = xss(escape(text));
  uid = escape(uid);

  // 更新时同时匹配 authorId 和 id
  const sql = `update todolist set text=${text} where authorId=${uid} and id=${id};`;

  return exec(sql).then((updateData) => {
    if (updateData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};
// 重排序 + 设置日常
const reroderTodo = (reorder, uid) => {
  let sqlcodeSortIndex = '';
  let sqlcodeIsDaily = '';
  let range = [];
  /**
   *  通过拼接字符串，使用 mysql 自带的 switch 语句进行批量更新
   * UPDATE todolist SET
   *   sortIndex = (CASE id
   *     WHEN 4222 THEN 1
   *     WHEN 4212 THEN 2
   *     WHEN 7634 THEN 3
   *     WHEN 9101 THEN 4
   *   END),
   *   idDaily = (CASE id
   *     WHEN 4222 THEN 1
   *     WHEN 4212 THEN 0
   *     WHEN 7634 THEN 0
   *     WHEN 9101 THEN 0
   *   END),
   * where id in (4222,4212,7634,9101) authorId=123
   */
  reorder.forEach((element) => {
    sqlcodeSortIndex += `WHEN ${escape(element.id)} THEN ${escape(
      element.sortIndex
    )}\n`;
    sqlcodeIsDaily += `WHEN ${escape(element.id)} THEN ${escape(
      element.isDaily
    )}\n`;
    range.push(escape(element.id));
  });
  range = `(${range.toString()})`;
  // console.log(sqlcodeSortIndex,sqlcodeIsDaily);
  const sql = `
    UPDATE todolist SET
      sortIndex = (CASE id
        ${sqlcodeSortIndex}
        END),
      isDaily = (CASE id
        ${sqlcodeIsDaily}
        END)
    where id in ${range} and authorId=${uid}
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
const completeTodo = (completeTodoId, uid) => {
  completeTodoId = escape(completeTodoId);
  uid = escape(uid);
  sql = `update todolist set isComplete=abs(isComplete-1) where authorId=${uid} and id=${completeTodoId};`;
  return exec(sql).then((completeData) => {
    if (completeData.affectedRows > 0) {
      return true;
    } else {
      return false;
    }
  });
};

// 清除已完成的日常任务
const clearDailyTodos = () => {
  const sql1 = `
  update todolist set isComplete=0 where isDaily=1;
  `;
  const sql2 = `
  delete from todolist where isComplete=1 and isDaily=0;
  `;
  exec(sql1);
  exec(sql2);
};

module.exports = {
  getList,
  addTodo,
  delTodo,
  updateTodo,
  reroderTodo,
  completeTodo,
  clearDailyTodos
};
