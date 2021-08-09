import "./App.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

// Local Components
import Controller from "./Controller";
import Layout from "./Layout";
import UserInput from "./UserInput/UserInput";
import ModelAnalysis from "./ModelAnalysis";

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  return (
    <Controller>
      <Layout setIsDataLoaded={setIsDataLoaded} isDataLoaded={isDataLoaded}>
        {!isDataLoaded && <UserInput />}
        {isDataLoaded && <ModelAnalysis />}
        {/* <UserInput /> */}
      </Layout>
    </Controller>
  );
}

export default App;
