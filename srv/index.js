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



const targetadcode = '100000';
utilarea.getamapdistrict_adcodelist(targetadcode,(jsondistricts)=>{
  _.map(jsondistricts,(obj)=>{
    let setGeo = _.omit(obj,['districts','center']);
    setGeo.parentadcode = targetadcode;
    GeoModel.findOneAndUpdate({
        adcode:obj.adcode,
     },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
       console.log(`result-->${JSON.stringify(result)}`)
     });

     const districts = _.get(obj,'districts',[]);
     _.map(districts,(dis)=>{
       let setGeo = _.omit(dis,['districts','center']);
       setGeo.parentadcode = obj.adcode;
       GeoModel.findOneAndUpdate({
           adcode:obj.adcode,
        },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
          console.log(`result-->${JSON.stringify(result)}`)
        });
     });
  });
});
