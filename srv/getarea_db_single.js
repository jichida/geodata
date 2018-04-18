//返回区的上级
const _ = require('lodash');
const getarea_db_single = (GeoModel,v,callback)=>{
  //考虑到有些省下级是区，所以筛选区的上级
  GeoModel.findOne({"level" : "city",
                  geometry:
                 {$geoIntersects:
                     {$geometry:{ "type" : "Point",
                          "coordinates" : [v.Longitude,v.Latitude] }
                      }
                  }
             }).lean().exec((err,ret)=>{
     if(!err && !!ret){
       callback({_id:v._id,adcode:ret.adcode,getflag:'fromdb'});
     }
     else{
       callback({_id:v._id});
     }
   });
}

module.exports = getarea_db_single;
