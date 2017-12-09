var cursor = db.getCollection('geo_osm').find({});
while(cursor.hasNext()) {
    x = cursor.next();
    print(x['id']+'\t'+x['properties']["admin_level"] + "\t" + x['properties']['name:zh']+ "\t" + x['properties']['name']);
}
