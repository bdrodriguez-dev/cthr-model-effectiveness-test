const fs = require("fs");
const csv = require("csv-parser");
const path = require("path");
const annotationsDirPath = path.join(
  __dirname,
  "/../uploads/annotations-data.csv"
);
const validationsDirPath = path.join(
  __dirname,
  "/../uploads/validations-data.csv"
);

const helpers = {
  getAnnotatedImagesArray: async () => {
    let annotations = [];
    // *** Master list ***
    let annotatedImages = [];

    const array = fs
      .createReadStream(annotationsDirPath)
      .pipe(csv())
      .on("data", function (err, row) {
        if (err) {
          console.log(`Error from helpers.js line 24: ${err}`);
        } else {
          // filename,category,score,left,top,bottom,right

          const roofObj = {
            filename: row.filename,
            category: row.category,
            score: row.score,
            annotation: [row.left, row.top, row.bottom, row.right],
          };

          annotations.push(roofObj);
        }
      })
      .on("end", function () {
        console.log("END event fired from line 39!!!");
        // console.log(annotations);
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
          // console.log(annotationObj);

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
            // console.log(annotatedImage);
            annotatedImages.push(annotatedImage);
            // console.log(annotatedImage);
            // console.log(annotatedImage);
            // console.log(annotatedImages);
          }
        });
        return annotatedImages;
      });

    // console.log(`line 77: ${JSON.stringify(array)}`);
    // return annotatedImages;
  },
  getValidationDataSetArray: () => {
    const validationAddresses = [];
    fs.createReadStream(validationsDirPath)
      .pipe(csv())
      .on("data", function (row) {
        const rowKey = Object.keys(row)[0];
        const address = row[rowKey].replace(";", ".").replace(".png", "");
        validationAddresses.push(address);
      })
      .on("end", function () {
        // console.log(`Validations read stream complete....`);
      });

    return validationAddresses;
  },
};

module.exports = helpers;
