var cursor = db.geo_osm.find({'properties.name:zh':{$exists:false}});
while (cursor.hasNext()) {
  var currentDocument = cursor.next();
  var name = currentDocument['properties']['name'];
  var znname = name;
  var n = name.indexOf(" ");
  if(n > 0){
    znname = name.substring(0,n);
 }
 currentDocument['properties']['name:zh'] = znname;
 db.geo_osm.update({_id: currentDocument._id}, currentDocument);
}
