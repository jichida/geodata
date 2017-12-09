db.getCollection('geo_osm').find({
'properties.admin_level':{$in:['4','5','6']},
geometry:
                 {
$geoIntersects:
                     {$geometry:{ "type" : "Point",
                          "coordinates" : [109.433671,24.350483] }
                      }
                  }
             });
