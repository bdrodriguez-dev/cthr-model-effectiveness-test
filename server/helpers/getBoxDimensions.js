const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");

const annotationsDirPath = path.join(__dirname, "/../assets/annotations.csv");

// filename,category,score,left,top,bottom,right

// const annotation = [
//   "1 SHELTON TER; TRUMBULL.png",
//   "missing-shingles",
//   0.9885315895080566,
//   0.7562717883973509,
//   0.5421279271443685,
//   0.5897599856058756,
//   0.7728130100546656,
// ];

const annotationBoxes = [];

fs.createReadStream(annotationsDirPath)
  .pipe(csv())
  .on("data", function (row) {
    const boxObj = {
      filename: row.filename,
      category: row.category,
      score: row.score,
      x1: row.left * 1184,
      y1: row.top * 768,
      x2: row.right * 1184,
      y2: row.bottom * 768,
    };

    annotationBoxes.push(boxObj);
  })
  .on("end", function () {
    console.log(JSON.stringify(annotationBoxes));
  });
