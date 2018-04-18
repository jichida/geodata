const _ = require('lodash');
const async = require('async');
const getamap_area_single = require('./getarea_db_single');
const getamap_area_batch = require('./getamap_area_batch');

const getallarea_all = (devicelist,callback)=>{
  //<-----
  let success_list = [];
  let failed_list = [];
  const fnsz = [];
  _.map(devicelist,(v)=>{
    /*
    _id,Longitude,Latitude
    */
    fnsz.push((callbackfn)=>{
      getamap_area_single(v,({_id,adcode,getflag})=>{
        if(!!adcode){
          success_list.push({_id,adcode,getflag});
        }
        else{
          failed_list.push(v);
        }
        callbackfn(null,true);
      });
    });
  });

  async.parallel(fnsz,(err,result)=>{
    callback({success_list,failed_list});
  });

}

const getallarea_all_fromamap = (devicelist,callback)=>{
  //将devicelist分20个一组
  let success_list = [];
  if(devicelist.length === 0){
    callback[];
    return;
  }
  const fnsz = [];
  for(let i = 0 ;i < devicelist.length; i += 20){
    const lend = i+20 > devicelist.length?devicelist.length:i+20;
    const target_devicelist = animals.slice(i, lend));
    _.map(target_devicelist,(v)=>{
      /*
      _id,Longitude,Latitude
      */
      fnsz.push((callbackfn)=>{
        getamap_area_batch(target_devicelist,(retlist)=>{
          success_list = _.concat(success_list, retlist);
        });
      });
  }

  async.series(asyncfnsz,(err,result)=>{
    callback(success_list);
  });
};


const getallarea_start = (devicelist,callback)=>{
  getallarea_all(devicelist,({success_list,failed_list})=>{
    getallarea_all_fromamap(failed_list,(ret)=>{
      let retlist = _.concat(success_list, ret);
      callback(retlist);
    });
  })
};
