const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const annotationsDirPath = path.join(__dirname, "/../assets/annotations.csv");
const trumbullDirPath = path.join(__dirname, "/../assets/trumbull-ds.csv");

const helpers = {
  getAnnotatedImagesArray: () => {
    const annotations = [];
    // *** Master list ***
    const annotatedImages = [];

    fs.createReadStream(annotationsDirPath)
      .pipe(csv())
      .on("data", function (row) {
        // filename,category,score,left,top,bottom,right
        const roofObj = {
          filename: row.filename,
          category: row.category,
          score: row.score,
          annotation: [row.left, row.top, row.bottom, row.right],
        };
        annotations.push(roofObj);
      })
      .on("end", function () {
        annotations.forEach((annotation) => {
          // Does the annotation's file already exist in annotatedImages
          const annotationImageIndex = annotatedImages.findIndex(
            (el) => el.filename === annotation.filename
          );

          // create annotation object to be added to annotatedImages array
          const annotationObj = {
            type: annotation.category,
            score: annotation.score,
            box: [
              annotation.annotation[0],
              annotation.annotation[1],
              annotation.annotation[2],
              annotation.annotation[3],
            ],
          };

          // If the annotationImage already exists add to its annotations array
          if (annotationImageIndex > -1) {
            annotatedImages[annotationImageIndex].annotations.push(
              annotationObj
            );
            // else create a new annotationImage and initialize its annotations array
          } else {
            const annotatedImage = {
              filename: annotation.filename,
              annotations: [],
            };
            annotatedImage.annotations.push(annotationObj);
            annotatedImages.push(annotatedImage);
          }
        });
      });
    return annotatedImages;
  },
  getTrumbullDataSetArray: () => {
    const trumbullAddresses = [];
    fs.createReadStream(trumbullDirPath)
      .pipe(csv())
      .on("data", function (row) {
        const rowKey = Object.keys(row)[0];
        const address = row[rowKey].replace(";", ".").replace(".png", "");
        trumbullAddresses.push(address);
      })
      .on("end", function () {
        //
      });
    return trumbullAddresses;
  },
};

module.exports = helpers;
