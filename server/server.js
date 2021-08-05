// Libraries
const express = require("express");
const path = require("path");
const multer = require("multer");
// Set Up Server
const app = express();
const PORT = 8000;
// Allow Cross Origin Resource Sharing
const cors = require("cors");
app.use(cors());
// Recognize the incoming Request Object as a JSON Object
app.use(express.json());
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

app.post("/", (req, res) => {
  uploadAllFiles(req, res, (err) => {
    if (err) {
      res.json({ msg: "Error loading files. Try again" });
    } else {
      // Get Files
      const annotationCsv = req.files[0];
      const validationCsv = req.files[0];
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// const {
//   getNaugatuckDataSetArray,
// } = require("./helpers/helpers");
// const annotatedImages = getAnnotatedImagesArray();
// const controlTrumbullArray = getTrumbullDataSetArray();
// const controlNaugyArray = getNaugatuckDataSetArray();

// app.get("/", (req, res) => {
//   res.send({
//     annotatedImages: annotatedImages,
//     controlArray: controlTrumbullArray,
//     controlNaugyArray: controlNaugyArray,
//   });
// });
