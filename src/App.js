import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Table from "react-bootstrap/Table";
import Card from "react-bootstrap/Card";

function App() {
  const [annotatedRoofs, setAnnotatedRoofs] = useState([]);
  const [trumbullData, setTrumbullData] = useState([]);

  useEffect(() => {
    async function fetchApi() {
      try {
        const response = await axios.get("http://localhost:8000/");
        setAnnotatedRoofs(response.data.annotatedImages);
        setTrumbullData(response.data.trumbullDataSet);
      } catch (err) {
        console.log(err);
      }
    }

    fetchApi();
  }, []);

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
    const numMissingShingles = roof.annotations.reduce(
      (accumulator, currentValue) => {
        if (currentValue.type === "patches") {
          accumulator = accumulator + 1;
        }
        return accumulator;
      },
      0
    );
    return numMissingShingles;
  };

  const calculateAverageScore = (roof, damageType) => {
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
    console.log(`${addScores} / ${damageScoreArray.length} = ${averageScore}`);
    return averageScore.toFixed(2);
  };

  const checkAgainstControl = (roof, control) => {
    // TODO: Implement this
  };

  return (
    <Card body style={{ width: "50rem", margin: "0 auto" }}>
      <Table striped hover bordered>
        <thead>
          <tr>
            <th>Address</th>
            <th>Town</th>
            <th># Missing Shingles</th>
            <th>Average Score</th>
            <th># Patches</th>
            <th>Average Score</th>
          </tr>
        </thead>
        <tbody>
          {annotatedRoofs.map((roof) => {
            return (
              <tr>
                <td>{getAddress(roof)}</td>
                <td>{getTown(roof)}</td>
                <td>{getNumMissingShingles(roof)}</td>
                <td>{calculateAverageScore(roof, "missing-shingles")}</td>
                <td>{getNumPatches(roof)}</td>
                <td>{calculateAverageScore(roof, "patches")}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </Card>
  );
}

export default App;
