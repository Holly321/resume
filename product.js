//引入express模块
const express=require('express');
//引入连接池模块
const pool=require('../pool.js');
//创建路由器
var router=express.Router();
//1.商品列表
router.get('/list',function(req,res){
  var obj=req.query;
  var count=obj.count;
  var pno=obj.pno;
  if(!count){
    count=5
  }
  if(!pno){
    pno=1
  }
  //转整型
  count=parseInt(count);
  pno=parseInt(pno);
  //计算
  var start=(pno-1)*count;
  //执行SQL语句
  pool.query('SELECT * FROM xz_laptop LIMIT ?,?',[start,count],function(err,result){
    if(err) throw err;
    res.send(result);
  });
});
//2.商品详情
router.get('/detail',function(req,res){
    //获取数据
    var obj=req.query;
    //console.log(obj)
    //验证数据是否为空
    if (!obj.lid) {
        res.send({ code: 401, msg: 'lid required' });
    }
    //执行SQL语句
    pool.query('SELECT * FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
      if (err) throw err;
      res.send(result);
    });

})
//3.删除商品
router.get('/delete',function(req,res){
  var obj=req.query;
  if(!obj.lid){
    res.send({code:401,mag:'lid required'})
  }
  pool.query('DELETE FROM xz_laptop WHERE lid=?',[obj.lid],function(err,result){
        if(err) throw err;
        //判断是否删除成功
        if(result.affectedRows>0){
            res.send({code:200,msg:'delete suc'});
        }
        else{
            res.send({code:301,msg:'delete err'})
        }
    });
  
})
//4.商品添加
router.post('/add',function(req,res){
  var obj=req.body;
  //验证数据是否为空
  //遍历对象，访问每个属性
  var i=400;
  for(var key in obj){
    i++;
    if(!obj[key]){
      res.send({code:401,msg:key+'require'})
      return;
    }
  }
  
  pool.query('INSERT INTO xz_laptop SET ? ',[obj],function(err,result){
        if(err) throw err;
        //console.log(result);
        //判断是否修改成功
        if(result.affectedRows>0){
            res.send({code:200,msg:'update suc'})
        }else{
            res.send({code:201,msg:'update error'})
        }
    });
})


//导出路由器对象
module.exports = router;
