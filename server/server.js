// Libraries
const express = require("express");
const path = require("path");
const fs = require("fs");
const csv = require("csv-parser");
const multer = require("multer");
// const {
//   getAnnotatedImagesArray,
//   getValidationDataSetArray,
// } = require("./helpers/helpers.js");
// Set Up Server
const app = express();
const PORT = 8000;
// Allow Cross Origin Resource Sharing
const cors = require("cors");
app.use(cors());
// Recognize the incoming Request Object as a JSON Object
app.use(express.json());

// Paths
const annotationsDirPath = path.join(
  __dirname,
  "./uploads/annotations-data.csv"
);
const validationsDirPath = path.join(
  __dirname,
  "./uploads/validations-data.csv"
);

// Set The Storage Engine
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: function (req, file, cb) {
    cb(null, file.fieldname + path.extname(file.originalname));
  },
});
// Init Upload
const uploadAllFiles = multer({
  storage: storage,
}).any();

/*****************
 **** ROUTES ****
 */

app.post("/annotations", (req, res) => {
  uploadAllFiles(req, res, () => {
    try {
      // file logs
      // console.log(req.files[0]);

      // Define arrays
      let annotations = [];
      // *** Master list ***
      let annotatedImagesArray = [];
      // read annotations-data.csv and process data into annotatedImages for return
      fs.createReadStream(annotationsDirPath)
        .pipe(csv())
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          // filename,category,score,left,top,bottom,right
          const roofObj = {
            filename: row.filename,
            category: row.category,
            score: row.score,
            annotation: [row.left, row.top, row.bottom, row.right],
          };

          annotations.push(roofObj);
        })
        .on("end", () => {
          annotations.forEach((annotation) => {
            // Does the annotation's file already exist in annotatedImages
            const annotationImageIndex = annotatedImagesArray.findIndex(
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
              annotatedImagesArray[annotationImageIndex].annotations.push(
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
              annotatedImagesArray.push(annotatedImage);
              // console.log(annotatedImage);
              // console.log(annotatedImage);
              // console.log(annotatedImages);
            }
          });
          console.log(annotatedImagesArray);
          // ** Response **
          res.send(annotatedImagesArray);
        });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

app.post("/validations", (req, res) => {
  uploadAllFiles(req, res, () => {
    try {
      // file log
      console.log(req.files[0]);

      // *** Master lists ***
      let validationAddresses = [];

      // read validations-data.csv and process data into validationDataSetArray for return
      fs.createReadStream(validationsDirPath)
        .pipe(csv())
        .on("error", (error) => {
          throw error.message;
        })
        .on("data", (row) => {
          const rowKey = Object.keys(row)[0];
          const address = row[rowKey].replace(";", ".").replace(".png", "");
          validationAddresses.push(address);
        })
        .on("end", () => {
          res.send(validationAddresses);
        });
    } catch (err) {
      console.log(err);
      res.send(err);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
