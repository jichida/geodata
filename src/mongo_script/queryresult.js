db.getCollection('geo_osm').aggregate(
  [
    {
        $match: {
            'geometry': {
                $geoIntersects: {
                    $geometry: {
                        "type": "Point",
                        "coordinates": [
                            109.433671,
                            24.350483
                        ]
                    }
                }
            }
        }
    },
    {
        $project: {
            name: '$properties.name:zh',
            admin_level: '$properties.admin_level',

        }
    },
    {
        $group: {
            _id: "$name",
            admin_level: {
                $first: "$admin_level"
            }
        }
    },
    {
        $sort: {
            "admin_level": 1
        }
    }
]
);
