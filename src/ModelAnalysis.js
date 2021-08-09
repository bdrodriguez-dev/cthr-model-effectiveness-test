import { useEffect, useState } from "react";

// Local Components
import MainData from "./MainData";
import MissedDetections from "./MissedDetections";
import Summary from "./Summary";

// Bootstrap Components
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";

/**
 * Preps address data and creates outputData which is used to populate the 3 tabs which comprises the main content that will be rendered: MainData, MissedDetections, and Summary
 * @method getAddress()
 * @param  props
 * @returns
 */
const ModelAnalysis = (props) => {
  const [isOutputArrayLoadedInState, setIsOutputArrayLoadedInState] =
    useState(false);
  const [isOutputArrayValidated, setIsOutputArrayValidated] = useState(false);

  useEffect(() => {
    createOutputArray(
      props.annotatedImagesArray,
      props.setAnnotatedImagesArray
    );

    setIsOutputArrayLoadedInState(true);
  }, [props.annotatedImagesArray, props.setAnnotatedImagesArray]);

  useEffect(() => {
    if (isOutputArrayLoadedInState) {
      // validate output array before rendering tabs
      if (Array.isArray(props.outputArray) && props.outputArray.length > 0) {
        setIsOutputArrayValidated(true);
      }
    }
  }, [isOutputArrayLoadedInState, props.outputArray]);

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
    // TODO: Make usable for any number of annotation category
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

    const scoreTotal = damageScoreArray.reduce((accumulator, currentValue) => {
      return accumulator + parseFloat(currentValue);
    }, 0);

    const scoreAverage = scoreTotal / damageScoreArray.length;
    return scoreAverage.toFixed(2);
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

  const createOutputArray = (
    _annotatedImagesArray,
    _setAnnotatedImagesArray
  ) => {
    console.log(_annotatedImagesArray);
    let tempOutputArray = _annotatedImagesArray.map((roof) => {
      const roofObj = {
        address: getAddress(roof),
        town: getTown(roof),
        numMissingShingles: getNumMissingShingles(roof),
        avgScoreMissingShingles: getAverageScore(roof, "missing-shingles"),
        numPatches: getNumPatches(roof),
        avgScorePatches: getAverageScore(roof, "patches"),
        status: checkAgainstControl(roof, props.validationDataSetArray),
      };
      return roofObj;
    });

    //sort by status
    const good = tempOutputArray.filter((output) => {
      return output.status === true;
    });

    const bad = tempOutputArray.filter((output) => {
      return output.status === false;
    });

    const fullOutputArray = good.concat(bad);

    if (Array.isArray(fullOutputArray) && fullOutputArray.length > 0) {
      console.log(
        `fullOutputArray from <ModelAnalysis> inside of createOutputArray func: ${JSON.stringify(
          fullOutputArray
        )}`
      );
      // return fullOutputArray;
      props.setOutputArray([...fullOutputArray]);
    }
  };

  // Create the outputArray

  return (
    <>
      {isOutputArrayValidated && (
        <Container>
          <Tabs defaultActiveKey="main-data" className="mb-3">
            <Tab eventKey="main-data" title="Main Data">
              {props.validationDataSetArray && (
                <MainData
                  annotatedRoofs={props.annotatedImagesArray}
                  controlArray={props.validationDataSetArray}
                  outputArray={props.outputArray}
                  statusAlertHandler={getStatusAlert}
                ></MainData>
              )}
            </Tab>
            <Tab eventKey="missed-detections" title="Missed Detections">
              {props.validationDataSetArray && (
                <MissedDetections
                  annotatedRoofs={props.annotatedImagesArray}
                  controlArray={props.validationDataSetArray}
                  missedDetections={props.missedDetections}
                  setMissedDetections={props.setMissedDetections}
                ></MissedDetections>
              )}
            </Tab>
            <Tab eventKey="summary" title="Summary">
              {props.validationDataSetArray && (
                <Summary
                  annotatedRoofs={props.annotatedImagesArray}
                  controlArray={props.validationDataSetArray}
                  outputArray={props.outputArray}
                  missedDetections={props.missedDetections}
                ></Summary>
              )}
            </Tab>
          </Tabs>
        </Container>
      )}
    </>
  );
};

export default ModelAnalysis;
