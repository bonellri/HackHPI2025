
type Point = [number, number];

function request(start: Point, end: Point) {
  let object = {};
  object["points"] = [start, end];
  object["profile"] = ""
  return JSON.stringify(object);
}
console.log(request([1.0, 2.1], [3.0, 4]));