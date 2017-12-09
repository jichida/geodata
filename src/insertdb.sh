#!bin/sh
for file in ./china/456/*
do
    if test -f $file
    then
        echo 开始执行 $file
        python geojson-mongo-import.py -f $file -d osm -c geo_osm
    fi
    if test -d $file
    then
        echo $file 是目录
    fi
done
