const express = require("express");
const app = express();

const PORT = 8000;

const cors = require("cors");
app.use(cors());

const {
  getAnnotatedImagesArray,
  getTrumbullDataSetArray,
} = require("./helpers/helpers");
const annotatedImages = getAnnotatedImagesArray();
const trumbullDataSet = getTrumbullDataSetArray();

app.get("/", (req, res) => {
  res.send({
    annotatedImages: annotatedImages,
    trumbullDataSet: trumbullDataSet,
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
