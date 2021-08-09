import React from "react";

const Layout = (props) => {
  const childrenWithProps = React.Children.map(props.children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        annotatedImagesArray: props.annotatedImagesArray,
        annotationFile: props.annotationFile,
        fileFormData: props.fileFormData,
        isSubmit: props.isSubmit,
        isDataLoaded: props.isDataLoaded,
        missedDetections: props.missedDetections,
        outputArray: props.outputArray,
        setAnnotatedImagesArray: props.setAnnotatedImagesArray,
        setAnnotationFile: props.setAnnotationFile,
        setFileFormData: props.setFileFormData,
        setIsDataLoaded: props.setIsDataLoaded,
        setIsSubmit: props.setIsSubmit,
        setMissedDetections: props.setMissedDetections,
        setOutputArray: props.setOutputArray,
        setUploadForm: props.setUploadForm,
        setValidationDataSetArray: props.setValidationDataSetArray,
        setValidationsFile: props.setValidationsFile,
        uploadForm: props.uploadForm,
        validationDataSetArray: props.validationDataSetArray,
        validationsFile: props.validationsFile,
      });
    }
  });
  return <main>{childrenWithProps}</main>;
};
export default Layout;
