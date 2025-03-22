
type Point = [number, number];

const EXCLUDE_AREA = 1 // meter
const EXCLUDE_AREA_LAT = 8.98311174991017e-06 * EXCLUDE_AREA
const EXCLUDE_AREA_LON = 1.4763165177199368e-05 * EXCLUDE_AREA

export function requestJSON(start: Point, end: Point, speedProfile, excludePoints = []) {
  let object = {};
  object["points"] = [start, end];
  object["profile"] = "foot";
  let speeds: any = [];
  let areas: any = [];
  speeds.concat(speedProfileJSON(speedProfile));
  for (let i = 0; i < excludePoints.length; i++) {
    let id = `area${i}`;
    areas.push({ point: excludePoints[i], id: id });
    speeds.push(speedJSON(`in_${id}`, 0));
  }
  object["custom_model"] = {"speeds": speeds}
  object["areas"] = areaJSON(areas);

  return JSON.stringify(object);
}

function areaJSON(areas) {
  let features: any = [];
  for (let area of areas) {
    const lat = area.point[0];
    const lon = area.point[1];
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
    })
  }
  return {
    "type": "FeatureCollection",
    "features": features
  }
}

function speedJSON(condition, speed) {
  return {
    "if": condition,
    "limit_to": speed
  }
}

/** list of speeds */
function speedProfileJSON(speedProfile) {
  let speeds: any = [];
  for (let key in speedProfile) {
    speeds.push(speedJSON(`surface == ${key}`, speedProfile[key]));
  }
  return speeds;
}

const wheelChairSpeedProfile = {
  "ASPHALT": 5,
  "SAND": 1e-10,
  "PAVING_STONES": 1,
}
const start: Point = [52.51, 13.37];
const end: Point = [52.52, 13.38];
const excludePoints = [
  [52.515, 13.375],
]



console.log(
  requestJSON(start, end, wheelChairSpeedProfile, excludePoints)
)
