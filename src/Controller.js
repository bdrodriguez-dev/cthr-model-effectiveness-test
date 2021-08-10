import React, { useState } from "react";
// import Layout from "./Layout";
// import UserInput from "./UserInput/UserInput";
// import ModelAnalysis from "./ModelAnalysis";

const Controller = (props) => {
  // Annotation and Validation Files
  const [annotationFile, setAnnotationFile] = useState({});
  const [validationsFile, setValidationsFile] = useState({});
  // FormData with above
  const [fileFormData, setFileFormData] = useState([]);
  // Flags
  const [isSubmit, setIsSubmit] = useState(false);
  // Arrays that will be used to render the tables
  const [annotatedImagesArray, setAnnotatedImagesArray] = useState([]);
  const [validationDataSetArray, setValidationDataSetArray] = useState([]);
  const [outputArray, setOutputArray] = useState([]);
  const [missedDetections, setMissedDetections] = useState([]);
  const [modelName, setModelName] = useState("");

  const childrenWithProps = React.Children.map(props.children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        annotatedImagesArray: annotatedImagesArray,
        annotationFile: annotationFile,
        fileFormData: fileFormData,
        isSubmit: isSubmit,
        missedDetections: missedDetections,
        outputArray: outputArray,
        setAnnotatedImagesArray: setAnnotatedImagesArray,
        setAnnotationFile: setAnnotationFile,
        setFileFormData: setFileFormData,
        setIsSubmit: setIsSubmit,
        setMissedDetections: setMissedDetections,
        setOutputArray: setOutputArray,
        setValidationDataSetArray: setValidationDataSetArray,
        setValidationsFile: setValidationsFile,
        validationDataSetArray: validationDataSetArray,
        validationsFile: validationsFile,
        modelName: modelName,
        setModelName: setModelName,
      });
    }
  });
  return childrenWithProps;
};

export default Controller;
