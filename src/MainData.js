import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";
import Alert from "react-bootstrap/Alert";

const MainData = (props) => {
  const [outputArray, setOutputArray] = useState([]);

  //   useEffect(() => {
  //     createOutputArray(props.annotatedRoofs);
  //   }, [props.annotatedRoofs]);

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
    // controlArray.forEach((control) => {
    //   console.log(control + " === " + address);
    //   //   return control === address;
    // });
    console.log(controlArray);
    console.log(address);
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

  const createOutputArray = (annotatedRoofs) => {
    let outputArray = [];
    annotatedRoofs.map((roof) => {
      const roofObj = {
        address: getAddress(roof),
        town: getTown(roof),
        numMissingShingles: getNumMissingShingles(roof),
        avgScoreMissingShingles: getAverageScore(roof, "missing-shingles"),
        numPatches: getNumPatches(roof),
        avgScorePatches: getAverageScore(roof, "patches"),
        status: checkAgainstControl(roof, props.controlArray),
      };

      outputArray.push(roofObj);
    });
    //sort by status
    // const good = [...outputArray].filter((output) => {
    //   return output.status === true;
    // });
    // console.log(good);

    // const bad = [...outputArray].filter((output) => {
    //   return output.status === false;
    // });
    // console.log(bad);

    // const fullout = good.concat(bad);
    // console.log(fullout);

    setOutputArray([...outputArray]);
  };

  //   checkAgainstControl(outputArray[0], props.controlArray);
  createOutputArray(props.annotatedRoofs);

  return (
    <Table striped hover bordered>
      <thead>
        <tr>
          <th>Address</th>
          <th>Town</th>
          <th># Missing Shingles</th>
          <th>Average Score</th>
          <th># Patches</th>
          <th>Average Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {outputArray.map((roof) => {
          return (
            <tr key={roof.address}>
              <td>{roof.address}</td>
              <td>{roof.town}</td>
              <td>{roof.numMissingShingles}</td>
              <td>{roof.avgScoreMissingShingles}</td>
              <td>{roof.numPatches}</td>
              <td>{roof.avgScorePatches}</td>
              <td>{getStatusAlert(roof)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default MainData;
