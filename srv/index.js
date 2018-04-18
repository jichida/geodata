const mongodburl = process.env.MONGO_URL || 'mongodb://localhost/amapgeo';
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const moment = require('moment');
const _ = require('lodash');
const utilarea = require('./utilarea');

//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });

//设备轨迹
const GeoSchema = new Schema({
}, { strict: false });
const GeoModel = mongoose.model('amapdistrict',  GeoSchema);


const initdistrict_basic = false;
const initdistrict_polyline = true;
if(initdistrict_basic){
  const targetadcode = '100000';
  const subdistrict = 3;
  utilarea.getamapdistrict_adcodelist(targetadcode,subdistrict,(jsondistricts)=>{
    _.map(jsondistricts,(objl1)=>{
      let setGeo = _.omit(objl1,['districts','center']);
      setGeo.parentadcode = targetadcode;
      GeoModel.findOneAndUpdate({
          adcode:objl1.adcode,
       },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
         console.log(`result-->${JSON.stringify(result)}`)
       });

       const districts = _.get(objl1,'districts',[]);
       _.map(districts,(objl2)=>{
         let setGeo = _.omit(objl2,['districts','center']);
         setGeo.parentadcode = objl1.adcode;//<---
         GeoModel.findOneAndUpdate({
             adcode:objl2.adcode,
          },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
            console.log(`result-->${JSON.stringify(result)}`)
          });

          const districts2 = _.get(objl2,'districts',[]);
          _.map(districts2,(objl3)=>{
            let setGeo = _.omit(objl3,['districts','center']);
            setGeo.parentadcode = objl2.adcode;
            GeoModel.findOneAndUpdate({
                adcode:objl3.adcode,
             },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
               console.log(`result-->${JSON.stringify(result)}`)
             });
           });
       });
    });
  });
}

if(initdistrict_polyline){
  GeoModel.find({
      "adcode" : "350900",
      "level" : "city",
   }).lean().exec((err,listcities)=>{
     if(!err && !!listcities){
       _.map(listcities,(ciyobj)=>{
         utilarea.getamapdistrict_polyline(ciyobj.adcode,(polyline)=>{
           console.log(`polyline-->${polyline}`);
         });
       });
     }
   });
 }
