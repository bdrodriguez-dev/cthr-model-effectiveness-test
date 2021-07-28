import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";

import MainData from "./MainData";
import MissedDetections from "./MissedDetections";

import "bootstrap/dist/css/bootstrap.min.css";

// import Card from "react-bootstrap/Card";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Container from "react-bootstrap/Container";

function App() {
  const [annotatedRoofs, setAnnotatedRoofs] = useState([]);
  const [controlArray, setControlArray] = useState([]);

  useEffect(() => {
    async function fetchApi() {
      try {
        const response = await axios.get("http://localhost:8000/");
        setAnnotatedRoofs(response.data.annotatedImages);
        setControlArray(response.data.controlArray);
        // console.log(response.data.controlArray);
      } catch (err) {
        console.log(err);
      }
    }

    fetchApi();
  }, []);

  return (
    <Container>
      <Tabs defaultActiveKey="main-data" className="mb-3">
        <Tab eventKey="main-data" title="Main Data">
          <MainData
            annotatedRoofs={annotatedRoofs}
            controlArray={controlArray}
          ></MainData>
        </Tab>
        <Tab eventKey="missed-detections" title="Missed Detections">
          <MissedDetections></MissedDetections>
        </Tab>
      </Tabs>
    </Container>
  );
}

export default App;
