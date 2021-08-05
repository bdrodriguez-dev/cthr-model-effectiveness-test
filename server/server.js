var express = require("express");
var app = express();
var PORT = 8000;
var cors = require("cors");
app.use(cors());
any[];
{ }
;
var _a = require("./helpers/helpers"), getAnnotatedImagesArray = _a.getAnnotatedImagesArray, getTrumbullDataSetArray = _a.getTrumbullDataSetArray, getNaugatuckDataSetArray = _a.getNaugatuckDataSetArray;
var annotatedImages = getAnnotatedImagesArray();
var controlTrumbullArray = getTrumbullDataSetArray();
var controlNaugyArray = getNaugatuckDataSetArray();
app.get("/", function (req, res) {
    res.send({
        annotatedImages: annotatedImages,
        controlArray: controlTrumbullArray,
        controlNaugyArray: controlNaugyArray
    });
});
app.listen(PORT, function () {
    console.log("Server running on port " + PORT);
});
