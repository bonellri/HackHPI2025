function request(start, end) {
    var object = {};
    object["points"] = [start, end];
    return JSON.stringify(object);
}
console.log(request([1.0, 2.1], [3.0, 4]));
