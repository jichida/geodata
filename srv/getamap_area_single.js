require('es6-promise').polyfill();
require('isomorphic-fetch');
const _ = require('lodash');

const key = 'dadfa0897bd9c8cff9cffdf330974b55';

//http://restapi.amap.com/v3/geocode/geo?parameters
const getarea = ({_id,Longitude,Latitude},callbackfn)=>{
  const url = `http://restapi.amap.com/v3/geocode/regeo?key=${key}&location=${Longitude},${Latitude}`;
  // //console.log(`url==>${url}`);
  // "key=" + key + "&location=" + location[0] + "," + location[1] +
  // "&poitype=商务住宅&radius=0&extensions=base&batch=false&roadlevel=0";
  fetch(url).then((res)=>{
    return res.json();
  }).then((json)=> {
    // //console.log(json);
    const regeocode = json.regeocode;
    if(!!regeocode){
      const citycode = _.get(regeocode,'addressComponent.citycode',0);
      callbackfn({_id,citycode,getflag:'fromamap'});
    }
    else{
      callbackfn({_id});
    }
  }).catch((e)=>{
    //console.log(e);
    callbackfn({_id});
  });
}

module.exports = getarea;
