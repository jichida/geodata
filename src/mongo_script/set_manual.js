执行：
db.getCollection('geo_osm').find({id:{'$in':[3231583,3231585,3231586,3231584,3293940,3293938,3293939,3316524,3293936,4574090,4574301,3293937,3231587,3231582]}});
后手工处理

其中3316524 --> 中国浙江省绍兴市上虞区
var cursor = db.getCollection('geo_osm').find({id:{'$in':[3231583,3231585,3231586,3231584,3293940,3293938,3293939,3316524,3293936,4574090,4574301,3293937,3231587,3231582]}});
while(cursor.hasNext()) {
    x = cursor.next();
    print(x['id']+'\t'+x['properties']["admin_level"] + "\t" + x['properties']['name:zh']+ "\t" + x['properties']['name']);
}
