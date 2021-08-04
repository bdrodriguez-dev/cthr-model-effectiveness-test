const express = require("express");
const app = express();

const PORT = 8000;

const cors = require("cors");
app.use(cors());

const {
  getAnnotatedImagesArray,
  getTrumbullDataSetArray,
  getNaugatuckDataSetArray,
} = require("./helpers/helpers");
const annotatedImages = getAnnotatedImagesArray();
const controlTrumbullArray = getTrumbullDataSetArray();
const controlNaugyArray = getNaugatuckDataSetArray();

app.get("/", (req, res) => {
  res.send({
    annotatedImages: annotatedImages,
    controlArray: controlTrumbullArray,
    controlNaugyArray: controlNaugyArray,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
