const mongodburl = process.env.MONGO_URL || 'mongodb://localhost/amapgeo';
const mongoose     = require('mongoose');
const async = require('async');
const Schema       = mongoose.Schema;
const moment = require('moment');
const _ = require('lodash');
const utilarea = require('./utilarea');
const getalldefault_devicegroups = require('./getallcities');
const getamap_area_batch = require('./getamap_area_batch');
const getamap_area_single = require('./getamap_area_single');
//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(mongodburl,{
    // useMongoClient: true,
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
const initdistrict_polyline = false;
if(initdistrict_basic){
  const targetadcode = '100000';
  const subdistrict = 3;
  utilarea.getamapdistrict_adcodelist(targetadcode,subdistrict,(jsondistricts)=>{
    _.map(jsondistricts,(objl1)=>{
      let setGeo = _.omit(objl1,['districts','center']);
      setGeo.parentadcode = targetadcode;
      setGeo.levelint = 1;
      GeoModel.findOneAndUpdate({
          adcode:objl1.adcode,
       },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
         console.log(`result-->${objl1.adcode}`)
       });

       const districts = _.get(objl1,'districts',[]);
       _.map(districts,(objl2)=>{
         let setGeo = _.omit(objl2,['districts','center']);
         setGeo.levelint = 2;
         setGeo.provicename = objl1.name;//<---
         setGeo.parentname = objl1.name;//<---
         setGeo.parentlevel = objl1.level;//<---
         setGeo.parentadcode = objl1.adcode;//<---
         GeoModel.findOneAndUpdate({
             adcode:objl2.adcode,
          },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
            console.log(`result-->${objl2.adcode}`)
          });

          const districts2 = _.get(objl2,'districts',[]);
          _.map(districts2,(objl3)=>{
            let setGeo = _.omit(objl3,['districts','center']);
            setGeo.levelint = 3;
            setGeo.provicename = objl1.name;//<---
            setGeo.parentname = objl2.name;
            setGeo.parentlevel = objl2.level;
            setGeo.parentadcode = objl2.adcode;
            GeoModel.findOneAndUpdate({
                adcode:objl3.adcode,
             },{$set:setGeo},{upsert:true,new:true}).lean().exec((err,result)=>{
               console.log(`result-->${objl3.adcode}`)
             });
           });
       });
    });
  });
}

if(initdistrict_polyline){
  const GeoModel = mongoose.model('amapdistrict',  GeoSchema);
  GeoModel.find({
      // "adcode" : "350900",
      // "level" : "city",
      geometry:{$exists:false}
   }).lean().exec((err,listcities)=>{
     if(!err && !!listcities){
       _.map(listcities,(ciyobj)=>{
         utilarea.getamapdistrict_polyline(ciyobj.adcode,(polyline)=>{
           console.log(`polyline-->${ciyobj.adcode},polyline:${!!polyline}`);
           if(!!polyline){
             let szpoint = [];
             let szpolygon = [];
             const blocklist = polyline.split('|');
             _.map(blocklist,(pl)=>{
               const latlnglist = pl.split(';');
               let szpoint = [];
               _.map(latlnglist,(latlng)=>{
                 const points = latlng.split(',');
                 const point = [
                   parseFloat(points[0]),
                   parseFloat(points[1]),
                 ];
                 szpoint.push(point);
               });
               szpolygon.push(szpoint);
             });

             const geometry = {
               "type" : "MultiPolygon",
               "coordinates" : [
                 szpolygon
               ]
             };
             GeoModel.findOneAndUpdate({
                 adcode:ciyobj.adcode,
              },{$set:{geometry}},{upsert:true,new:true}).lean().exec((err,result)=>{
                console.log(`result-->${result.adcode}`)
              });
          }
        });
       });
     }
   });
 }

const testdevice = [
  {
    _id:'5aab1ee3b8495bf6d0bc46ff',
    "Longitude" : 121.535496,
    "Latitude" : 31.367648,
  },
  {
    _id:'5aab1eeab8495bf6d0bc4c5a',
    "Longitude" : 121.62202,
    "Latitude" : 31.299704,
  },
];

getamap_area_batch(testdevice,(result)=>{
  console.log(`getamap_area_batch---->${JSON.stringify(result)}`);
});

// getamap_area_single(testdevice[0],(result)=>{
//   console.log(`getamap_area_single---->${JSON.stringify(result)}`);
// });
// getalldefault_devicegroups(GeoModel,(grouplist)=>{
//   console.log(JSON.stringify(grouplist));
//   console.log(grouplist.length);
// })
