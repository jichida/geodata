//返回区的上级
const _ = require('lodash');
const getalldefault_devicegroups = (GeoModel,callback)=>{
  //考虑到有些省下级是区，所以筛选区的上级
  GeoModel.find({
      "level" : "district",
   },{
     "provicename":1,
     "levelint":1,
     "parentlevel" : 1,
     "parentadcode" : 1,
     "parentname" : 1
   }).lean().exec((err,listcities)=>{
     if(!err && !!listcities){
       //先排序,后去重
       listcities = _.sortBy(listcities, [(o)=>{
         const key = `${o.parentadcode}`;
         return key;
       }]);

       listcities = _.sortedUniqBy(listcities,(o)=>{
         const key = `${o.parentadcode}`;
         return key;
       });

       let devicelist = [];
       _.map(listcities,(v)=>{
         devicelist.push({
           name:v.levelint > 2 ?`${v.provicename}${v.parentname}`:v.parentname,
           adcode:v.parentadcode,
           level:v.parentlevel
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
