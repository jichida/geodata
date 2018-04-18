require('es6-promise').polyfill();
require('isomorphic-fetch');
const _ = require('lodash');

const key = 'dadfa0897bd9c8cff9cffdf330974b55';

//http://restapi.amap.com/v3/geocode/geo?parameters
const getareasz = (devicelist,callbackfn)=>{
  let alllocations = '';
  _.map(devicelist,(v,index)=>{
    alllocations += `${v.Longitude},${v.Latitude}`;
    if(index !== devicelist.length - 1){
      alllocations += '|';
    }
  });
  let retlist = [];
  const url = `http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${alllocations}&batch=true`;
  console.log(`url==>${url}`);
  // "key=" + key + "&location=" + location[0] + "," + location[1] +
  // "&poitype=商务住宅&radius=0&extensions=base&batch=false&roadlevel=0";
  fetch(url).then((res)=>{
    return res.json();
  }).then((json)=> {
    const regeocodes = json.regeocodes;
    if(regeocodes.length === devicelist.length){
      _.map(devicelist,(v,index)=>{
        const adcode = _.get(regeocodes[index],'addressComponent.adcode');
        retlist.push({_id:v._id,adcode});
      });
    }
    callbackfn(retlist);
  }).catch((e)=>{
    console.log(e);
    callbackfn(retlist);
  });
}

module.exports = getareasz;
