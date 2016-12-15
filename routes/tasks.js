var express = require('express');
var router = express.Router();
//mongodb 连接设置
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectId;
var DB_CONN_STR = 'mongodb://localhost:27017/health';

//任务列表
router.get('/', function(req, res) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        //连接到表
        var collection = db.collection('todo_development');
        //查询数据
        var whereStr = {};
        collection.find(whereStr).toArray(function(err, result) {
            if(err)
            {
                res.send('select error');
            }
            else{
                res.render('tasks/index',{title:"Todos index view",task_list:result});
            }
        });
        db.close();
    });
});

//显示添加任务表单
router.get('/new',function (req,res) {
    res.render('tasks/new',{title:"New task"});
});

//添加任务
router.post('/',function (req,res) {
    var task = req.body.task;
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        //连接到表
        var collection = db.collection('todo_development');
        var data = {task:task};
        collection.insert(data,function (err,result) {
            if(err){
                res.send('insert error');
            }
            else{
                res.redirect('/tasks');
            }
        });
        db.close();
    });
});

//显示编辑任务表单
router.get('/edit/:id',function (req,res) {
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        //连接到表
        var collection = db.collection('todo_development');
        //查询数据
        var whereJson = {_id:ObjectID(req.params.id)};
        collection.findOne(whereJson,function(err, result) {
            console.log(result);
            if(err)
            {
                res.send('select error');
            }
            else{
                res.render('tasks/edit',{title:"编辑任务",task:result});
            }
        });
        db.close();
    });
})

//修改任务
router.put('/:id',function (req,res) {
    var id = req.params.id;
    var task = req.body.task;
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        //连接到表
        var collection = db.collection('todo_development');
        //查询数据
        var whereJson = {_id:ObjectID(req.params.id)};
        //修改数据
        var dataJson = {$set:{task:task}};
        collection.updateOne(whereJson,dataJson,function(err, result) {
            console.log(result);
            if(err)
            {
                res.send('update error');
            }
            else{
                res.redirect('/tasks');
            }
        });
        db.close();
    });
});

//删除任务
router.delete('/:id',function (req,res) {
    var id = req.params.id;
    MongoClient.connect(DB_CONN_STR, function(err, db) {
        //连接到表
        var collection = db.collection('todo_development');
        //查询数据
        var whereJson = {_id:ObjectID(req.params.id)};
        collection.deleteOne(whereJson,function(err, result) {
            console.log(result);
            if(err)
            {
                res.send('delete error');
            }
            else{
                res.redirect('/tasks');
            }
        });
        db.close();
    });
})

module.exports = router;