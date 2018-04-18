//返回区的上级
const _ = require('lodash');
const getalldefault_devicegroups = (GeoModel,callback)=>{
  //考虑到有些省下级是区，所以筛选区的上级
  //应该按citycode groupby 并取levelint最小值
  // GeoModel.aggregate([
  //   {
  //     $match: {levelint:{$lt:3}}
  //   },
  //   {
  //     $group: {
  //         _id: {citycode:"$citycode",name: "$name",levelint:"$levelint"},
  //         citycode:{
  //           $first: "$citycode"
  //         },
  //         levelint:{
  //           $first: "$levelint"
  //         },
  //         name: {
  //           $first: "$name"
  //         }
  //       }
  //   },
  //   {
  //       $sort: {
  //           "levelint": 1
  //       }
  //   },
  //   {
  //       $group: {
  //           _id: {citycode:"$citycode"},
  //           levelint:{
  //             $first: "$levelint"
  //           },
  //           name: {
  //             $first: "$name"
  //           }
  //       }
  //   }
  // ])
  GeoModel.find({
        levelint:{$lt:3},
        citycode:{$type:2},
        level:{$in:['city','provice']}
   },{
     "name":1,
     "citycode":1,
     "provicename":1,
   }).lean().exec((err,listcities)=>{
     if(!err && !!listcities){
       let devicelist = [];
       _.map(listcities,(v)=>{
         devicelist.push({
           name:level === 'city' ?`${v.provicename}${v.name}`:v.name,
           citycode:v.citycode,
           level:v.level
         });
       });
       callback(devicelist);
     }
     else{
       callback([]);
     }
   });
}

module.exports = getalldefault_devicegroups;
