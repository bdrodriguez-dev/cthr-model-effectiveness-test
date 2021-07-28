import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import MainData from "./MainData";
import MissedDetections from "./MissedDetections";
import Summary from "./Summary";

import "bootstrap/dist/css/bootstrap.min.css";

// import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

function App() {
  const [annotatedRoofs, setAnnotatedRoofs] = useState([]);
  const [controlArray, setControlArray] = useState(null);
  const [outputArray, setOutputArray] = useState([]);

  useEffect(() => {
    async function fetchApi() {
      try {
        const response = await axios.get("http://localhost:8000/");
        const annotatedRoofsData = response.data.annotatedImages;
        const controlArrayData = response.data.controlArray;

        setAnnotatedRoofs(annotatedRoofsData);
        setControlArray(controlArrayData);

        const outputArrayRaw = createOutputArray(
          annotatedRoofsData,
          controlArrayData
        );
        setOutputArray(outputArrayRaw);
      } catch (err) {
        console.log(err);
      }
    }
    fetchApi();
  }, []);

  // useEffect(() => {
  //   createOutputArray(annotatedRoofs);
  // }, [annotatedRoofs, controlArray]);

  const getAddress = (roof) => {
    const filename = roof.filename;
    const sliceIndex = filename.indexOf("; ");
    const address = filename.slice(0, sliceIndex);

    return address;
  };

  const getTown = (roof) => {
    const filename = roof.filename;
    const sliceIndex = filename.indexOf("; ") + 2;
    const townName = filename.slice(sliceIndex).replace(".png", "");

    return townName;
  };

  const getNumMissingShingles = (roof) => {
    const numMissingShingles = roof.annotations.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === "missing-shingles") {
          accumulator = accumulator + 1;
        }
        return accumulator;
      },
      0
    );
    return numMissingShingles;
  };

  const getNumPatches = (roof) => {
    const numPatches = roof.annotations.reduce((accumulator, currentValue) => {
      if (currentValue.type === "patches") {
        accumulator = accumulator + 1;
      }
      return accumulator;
    }, 0);
    return numPatches;
  };

  const getAverageScore = (roof, damageType) => {
    const damageScoreArray = roof.annotations
      .filter((annotation) => {
        return annotation.type === damageType;
      })
      .map((annotation) => {
        return annotation.score;
      });

    if (damageScoreArray.length === 0) {
      return 0;
    }

    const addScores = damageScoreArray.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue);
    }, 0);

    const averageScore = addScores / damageScoreArray.length;
    return averageScore.toFixed(2);
  };

  const checkAgainstControl = (roof, controlArray) => {
    const address = roof.filename.replace(";", ".").replace(".png", "");

    const detectionStatus = controlArray.includes(address);

    // return isRoofInControl ? "true" : "false-positive";
    return detectionStatus;
  };

  const getStatusAlert = (roof) => {
    const alert = (
      <Alert variant={roof.status ? "success" : "danger"}>
        {roof.status ? "Valid Annotation" : "FP"}
      </Alert>
    );
    return alert;
  };

  const createOutputArray = (annotatedRoofs, controlArray) => {
    let outputArray = [];
    annotatedRoofs.map((roof) => {
      const roofObj = {
        address: getAddress(roof),
        town: getTown(roof),
        numMissingShingles: getNumMissingShingles(roof),
        avgScoreMissingShingles: getAverageScore(roof, "missing-shingles"),
        numPatches: getNumPatches(roof),
        avgScorePatches: getAverageScore(roof, "patches"),
        status: checkAgainstControl(roof, controlArray),
      };

      outputArray.push(roofObj);
    });
    //sort by status
    const good = [...outputArray].filter((output) => {
      return output.status === true;
    });

    const bad = [...outputArray].filter((output) => {
      return output.status === false;
    });

    const fullOutputArray = good.concat(bad);

    return fullOutputArray;
  };

  const getMissedDetections = (annotatedRoofs, controlArray) => {
    const missedDetections = controlArray.filter((controlAddress) => {
      const annotationFilenames = annotatedRoofs.map((roof) => {
        return roof.filename.replace(";", ".").replace(".png", "");
      });
      return !annotationFilenames.includes(controlAddress);
    });

    return missedDetections;
  };

  //   checkAgainstControl(outputArray[0], props.controlArray);
  // createOutputArray(annotatedRoofs);

  return (
    <Container>
      <Tabs defaultActiveKey="main-data" className="mb-3">
        <Tab eventKey="main-data" title="Main Data">
          {controlArray && (
            <MainData
              annotatedRoofs={annotatedRoofs}
              controlArray={controlArray}
              outputArray={outputArray}
              statusAlertHandler={getStatusAlert}
            ></MainData>
          )}
        </Tab>
        <Tab eventKey="missed-detections" title="Missed Detections">
          {controlArray && (
            <MissedDetections
              annotatedRoofs={annotatedRoofs}
              controlArray={controlArray}
              getMissedDetections={getMissedDetections}
            ></MissedDetections>
          )}
        </Tab>
        <Tab eventKey="summary" title="Summary">
          {controlArray && (
            <Summary
              annotatedRoofs={annotatedRoofs}
              controlArray={controlArray}
              outputArray={outputArray}
              getMissedDetections={getMissedDetections}
            ></Summary>
          )}
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
