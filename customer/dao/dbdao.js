let mysql = require('mysql');

// 创建 mysql 连接池资源
let pool = mysql.createPool({
    host: 'localhost',
    user: 'apiuser',
    password: 'apiuser123!',
    database: 'openapi'
});

exports.query = function (sql, arr, callback) {
    //建立链接
    pool.getConnection(function (err, connection) {
        if (err) { throw err; return; }
        connection.query(sql, arr, function (error, results, fields) {
            //将链接返回到连接池中，准备由其他人重复使用
            pool.releaseConnection(connection);
            if (error) throw error;
            //执行回调函数，将数据返回
            callback && callback(results, fields);
        });
    });
};

exports.insert = function (sql, arr, callback, errHandler) {
    //建立链接
    pool.getConnection(function (err, connection) {
        if (err) { throw err; return; }
        connection.query(sql, arr, function (error, results, fields) {
            //将链接返回到连接池中，准备由其他人重复使用
            pool.releaseConnection(connection);
            if (error) {
                if (errHandler) {
                    errHandler(error);
                    return;
                }
            } else {
                //执行回调函数，将数据返回
                callback && callback(results, fields);
            }
        });
    });
};

exports.update = function (sql, arr, callback, errHandler) {
    //建立链接
    pool.getConnection(function (err, connection) {
        if (err) { throw err; return; }
        connection.query(sql, arr, function (error, results, fields) {
            //将链接返回到连接池中，准备由其他人重复使用
            pool.releaseConnection(connection);
            if (error) {
                if (errHandler) {
                    errHandler(error);
                    return;
                }
            } else {
                //执行回调函数，将数据返回
                callback && callback(results, fields);
            }
        });
    });
};