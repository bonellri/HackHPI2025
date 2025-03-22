var EXCLUDE_AREA = 1; // meter
var EXCLUDE_AREA_LAT = 8.98311174991017e-06 * EXCLUDE_AREA;
var EXCLUDE_AREA_LON = 1.4763165177199368e-05 * EXCLUDE_AREA;
function request(start, end, speedProfile, excludePoints) {
    if (excludePoints === void 0) { excludePoints = []; }
    var object = {};
    object["points"] = [start, end];
    object["profile"] = "foot";
    var speeds = [];
    var areas = [];
    speeds.concat(speedProfileJSON(speedProfile));
    for (var i = 0; i < excludePoints.length; i++) {
        var id = "area".concat(i);
        areas.push({ point: excludePoints[i], id: id });
        speeds.push(speedJSON("in_".concat(id), 0));
    }
    object["custom_model"] = { "speeds": speeds };
    object["areas"] = areaJSON(areas);
    return JSON.stringify(object);
}
function areaJSON(areas) {
    var features = [];
    for (var _i = 0, areas_1 = areas; _i < areas_1.length; _i++) {
        var area = areas_1[_i];
        var lat = area.point[0];
        var lon = area.point[1];
        features.push({
            "type": "Feature",
            "id": area.id,
            "properties": {},
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [lat - EXCLUDE_AREA_LAT / 2, lon - EXCLUDE_AREA_LON / 2],
                    [lat + EXCLUDE_AREA_LAT / 2, lon - EXCLUDE_AREA_LON / 2],
                    [lat + EXCLUDE_AREA_LAT / 2, lon + EXCLUDE_AREA_LON / 2],
                    [lat - EXCLUDE_AREA_LAT / 2, lon + EXCLUDE_AREA_LON / 2],
                    [lat - EXCLUDE_AREA_LAT / 2, lon - EXCLUDE_AREA_LON / 2]
                ]
            }
        });
    }
    return {
        "type": "FeatureCollection",
        "features": features
    };
}
function speedJSON(condition, speed) {
    return {
        "if": condition,
        "limit_to": speed
    };
}
/** list of speeds */
function speedProfileJSON(speedProfile) {
    var speeds = [];
    for (var key in speedProfile) {
        speeds.push(speedJSON("surface == ".concat(key), speedProfile[key]));
    }
    return speeds;
}
var wheelChairSpeedProfile = {
    "ASPHALT": 5,
    "SAND": 1e-10,
    "PAVING_STONES": 1,
};
var start = [52.51, 13.37];
var end = [52.52, 13.38];
var excludePoints = [
    [52.515, 13.375],
];
console.log(request(start, end, wheelChairSpeedProfile, excludePoints));
