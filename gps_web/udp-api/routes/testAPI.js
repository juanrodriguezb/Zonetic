require('dotenv').config()
var express = require("express");
var mysql = require('mysql');
const stringify= require("querystring");
var router = express.Router();
var udp = require('dgram');
var ENV = require('./env.json');
const wait= require("@testing-library/react");
const { resolve } = require("path");
const { rejects } = require("assert");


global.id=0;

const HOST=ENV.HOST;
const PORT=ENV.PORT;
const USER=ENV.USER;
const PASSWORD=ENV.PASSWORD;
const DATA=ENV.DATA;

var con = mysql.createConnection({
  host: HOST,
  port: PORT,
  user: USER,
  password: PASSWORD,
  database: DATA
});

function connectDatabase(){

  var last_row=0;

  con.query(("SELECT * FROM truckdata WHERE id = (SELECT MAX(id) FROM truckdata)"), function (err, result) {

    if (err) throw err;

    last_row=result;
    last_row=JSON.parse(JSON.stringify(last_row));
    last_row=last_row[0];

    try{
      console.log("\n");
      console.log("Last table ID obtained");
      global.id=last_row.id;
      console.log(global.id);
      console.log("\n");
    }catch(err){
      console.log("\n");
      console.log("Last table ID obtained");
      global.id=0;
      console.log(global.id);
      console.log("\n");
    }

  });

}

function connectDatabaserpm(){

  var last_rrow=0;

  con.query(("SELECT * FROM truckrpm WHERE id = (SELECT MAX(id) FROM truckrpm)"), function (err, result) {

    if (err) throw err;

    last_rrow=result;
    last_rrow=JSON.parse(JSON.stringify(last_rrow));
    last_rrow=last_rrow[0];

    try{
      console.log("\n");
      console.log("Last table ID obtained");
      global.id=last_rrow.id;
      console.log(global.id);
      console.log("\n");
    }catch(err){
      console.log("\n");
      console.log("Last table ID obtained");
      global.id=0;
      console.log(global.id);
      console.log("\n");
    }

  });

}

function Updatetable(message){

  return new Promise((resolve,reject)=>{
    var buff_sql=message.split("\n");
    (global.id)=(global.id)+1;
    var i_str=(global.id).toString();

    var sql = ("INSERT INTO truckdata (id,lat, lng, alt, timegps, truck) VALUES (").concat(i_str,",",buff_sql[1],"," ,buff_sql[0],",", buff_sql[2],",",buff_sql[3],",",buff_sql[4],')');

    con.query(sql, function (err, result) {
      if (err) throw err;
      return err ? reject(err): resolve("1 record inserted");
    });

  });

}

function GetLast(truck1){

  return new Promise((resolve,reject)=>{
    con.query((("SELECT lat,lng,alt,timegps FROM truckdata WHERE truck = ").concat((truck1).toString()," ORDER BY id desc limit 1")),
      function Getlasmessage(err,result){
        var lastposition=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(lastposition);
      }
    );     
  });

}

function GetLast2(truck2){
  return new Promise((resolve,reject)=>{
    con.query((("SELECT lat,lng,alt,timegps FROM truckdata WHERE truck = ").concat((truck2).toString()," ORDER BY id desc limit 1")),
      function Getlasmessage2(err, result){
        var lastposition2=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(lastposition2);
      }
    );
  });
}

function Gethistory(truck1,time_in,time_fin){
  return new Promise((resolve,reject)=>{
    con.query((("SELECT lat,lng FROM truckdata WHERE truck = ").concat((truck1).toString()," AND timegps BETWEEN ",(time_in).toString(),' and ',(time_fin).toString())),
      function(err,result){
        if(err){throw err};
        var history=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(history);
      }
    );
  });

}

function Gethistory2(truck2, time_in, time_fin){
  return new Promise((resolve, reject)=>{
    con.query((("SELECT lat,lng FROM truckdata WHERE truck = ").concat((truck2).toString()," AND timegps BETWEEN ",(time_in).toString(),' and ',(time_fin).toString())),
      function(err,result){
        if(err){throw err};
        var history2=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(history2);
      }
    );
  })
}

function GetInfo(time_in,time_fin,truck1,position){
  return new Promise((resolve,reject)=>{
    con.query((("SELECT timegps FROM truckdata WHERE truck = ").concat((truck1).toString()," AND lat = ",(position.lat).toString()," AND lng = ",(position.lng).toString()," AND timegps BETWEEN ",(time_in).toString()," and ",(time_fin).toString())),
      function(err,result){
        if(err){throw err};
        var info=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(info)
      }
    );
  });
}

function GetInfo2(time_in,time_fin,truck2,position){
  return new Promise((resolve,reject)=>{
    con.query((("SELECT timegps FROM truckdata WHERE truck = ").concat((truck2).toString()," AND lat = ",(position.lat).toString()," AND lng = ",(position.lng).toString()," AND timegps BETWEEN ",(time_in).toString()," and ",(time_fin).toString())),
      function(err,result){
        if(err){throw err};
        var info=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(info)
      }
    );
  });
}

function Getrpm(truck1){
  return new Promise((resolve, reject)=>{
    con.query((("SELECT rpm FROM truckrpm WHERE truck = ").concat((truck1).toString()," ORDER BY id asc limit 20019")),
      function Getallrpm(err, result){
        var allrpm=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(allrpm);
      }
    );
  });
}

function Getrpm2(truck2){
  return new Promise((resolve, reject)=>{
    con.query((("SELECT rpm FROM truckrpm WHERE truck = ").concat((truck2).toString()," ORDER BY id asc limit 20019")),
      function Getallrpm2(err, result){
        var allrpm2=JSON.parse(JSON.stringify(result));
        return err ? reject(err): resolve(allrpm2);
      }
    );
  });
}

var server= udp.createSocket('udp4');
server.bind(5000);

server.on('listening',function(){
  try{
    address=server.address();
    port= address.port;
    ipaddr = address.address;
    console.log('Server is listening at port ' + port);
    console.log('Server ip :' + ipaddr);
    connectDatabase()
    connectDatabaserpm()
  }catch(error){
    console.error();
  }
});

server.on('message',function(msg,info){
  
  try{
    var message=msg.toString();
    async function Update(){
      console.log(await Updatetable(message));
    }
    Update();
  }catch(error){
    console.error();
  }

});

router.post("/history", function(req, res, next) {

  try{
    var time_in=req.body.timestamp_in;
    var time_fin=req.body.timestamp_fin;
    var truck1=req.body.ID1;
    async function History(){
      var history= await Gethistory(truck1,time_in,time_fin);
      res.json(history);
    }
    History();
  }catch(error){
    console.error();
  }
  
});

router.post("/history2", function(req, res, next) {

  try{
    var time_in=req.body.timestamp_in;
    var time_fin=req.body.timestamp_fin;
    var truck2=req.body.ID2;
    async function History2(){
      var history2= await Gethistory2(truck2,time_in,time_fin);
      res.json(history2);
    }
    History2();
  }catch(error){
    console.error();
  }
  
});

router.post("/info", function(req, res, next) {
  try{
    var time_in=req.body.timestamp_in;
    var time_fin=req.body.timestamp_fin;
    var truck1=req.body.ID1;
    var position=req.body.position;
    async function Info() {
      var info = await GetInfo(time_in,time_fin,truck1,position);
      res.json(info);  
    }
    Info();
  }catch(error){
    console.error();
  }
})

router.post("/info2", function(req, res, next) {
  try{
    var time_in=req.body.timestamp_in;
    var time_fin=req.body.timestamp_fin;
    var truck2=req.body.ID2;
    var position=req.body.position;
    async function Info2() {
      var info = await GetInfo2(time_in,time_fin,truck2,position);
      res.json(info);  
    }
    Info2();
  }catch(error){
    console.error();
  }
})

router.post("/last", function(req,res, next){

  try{
    var truck1=req.body.ID1;
    async function Last(){
      var last1=await GetLast(truck1);
      res.json(last1);
    }
    Last();
  }catch(error){
    console.error();
  }
  
});

router.post("/last2", function(req, res, next){
  try{
    var truck2=req.body.ID2;
    async function Last2(){
      var last2=await GetLast2(truck2);
      res.json(last2);
    }
    Last2();
  }catch(error){
    console.error();
  }
});

router.post("/rpm", function(req, res,next){
  try{
    var truck1=req.body.ID1;
    async function Rmp(){
      var rmp=await Getrpm(truck1);
      res.json(rmp);
    }
    Rmp();
  }catch(error){
    console.error();
  }
});

router.post("/rpm2", function(req, res,next){
  try{
    var truck2=req.body.ID2;
    async function Rmp2(){
      var rmp2=await Getrpm2(truck2);
      res.json(rmp2);
    }
    Rmp2();
  }catch(error){
    console.error();
  }
});

module.exports = router;