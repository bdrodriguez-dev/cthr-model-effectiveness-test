const express = require("express");
const app = express();

var multer = require("multer");
var upload = multer({ dest: "uploads/" });

const PORT = 8000;

const cors = require("cors");
app.use(cors());
app.use(express.json());

// const {
//   getAnnotatedImagesArray,
//   getTrumbullDataSetArray,
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

app.post("/", upload.single("annotations-data"), (req, res) => {
  //TODO: this
  console.log("line32, server.js");
  console.log("line34, server.js");
  console.log(req.file);
  // try {
  //   // const userInputFormData = req.body;
  // } catch (error) {
  //   console.log(error);
  // }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
