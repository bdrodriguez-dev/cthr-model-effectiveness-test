import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";

import ErrorMessage from "./ErrorMessage";

const UserInput = ({
  annotatedImagesArray,
  annotationFile,
  fileFormData,
  isSubmit,
  setAnnotatedImagesArray,
  setAnnotationFile,
  setFileFormData,
  setIsDataLoaded,
  setIsSubmit,
  setMissedDetections,
  setValidationDataSetArray,
  setValidationsFile,
  validationDataSetArray,
  validationsFile,
  missedDetections,
}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [areMainArraysLoaded, setAreMainArraysLoaded] = useState(false);
  const [isMissedDetectionsLoaded, setIsMissedDetectionsLoaded] =
    useState(false);

  /**
   * This useEffect sends two posts requests from the server to upload the annotations and validations files and then recieves the modified data back from the server
   * */
  useEffect(() => {
    // Make the post request if user has submitted
    if (isSubmit) {
      // Get annotations from server and set in state.
      getAnnotationsFromServer();

      // Get validations from server and set in state.
      getValidationsFromServer();

      setAreMainArraysLoaded(true);
    }
  }, [isSubmit]);

  /**
   * This useEffect loads the annotations and validations arrays in state only after they are recieved from the server and are validated for proper shape
   */
  useEffect(() => {
    if (areMainArraysLoaded) {
      if (
        isArrayLoadedInState(annotatedImagesArray) &&
        isArrayLoadedInState(validationDataSetArray)
      ) {
        // Generate missed detections list and set in state.
        generateMissedDetectionsList(
          annotatedImagesArray,
          validationDataSetArray,
          setMissedDetections
        );
      }
      setIsMissedDetectionsLoaded(true);

      // console.log(
      //   "Data loaded from file upload... ANNOTATIONS, VALIDATIONS, MISSED DETECTIONS"
      // );
    }
  }, [areMainArraysLoaded, annotatedImagesArray, validationDataSetArray]);

  /**
   * This useEffect creates the missedDetections array only after annotations and validations arrays are properly loaded into state
   */
  useEffect(() => {
    if (isMissedDetectionsLoaded) {
      if (isArrayLoadedInState(missedDetections)) {
        //set final flag
        console.log(missedDetections);
        setIsDataLoaded(true);
      }
    }
  }, [isMissedDetectionsLoaded, missedDetections]);

  /**
   * Validates data arrays like annotatedImagesArray, validationDataSetArray, and missedDetections for proper shape (array with at least one element)
   *
   * @param array: annotatedImagesArray, validationDataSetArray, or missedDetections arrays
   * @returns boolean
   *    [true] if array is an ARRAY with at least one element
   *    else [false]
   */
  const isArrayLoadedInState = (array) => {
    return Array.isArray(array) && array.length > 0;
  };

  /**
   * Toggles showModal
   */

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  /**
   * On form submit, generate formData, append files, and set isSubmit flag to true to trigger first useEffect (to make post requests to server with files)
   * @param {*} e
   */
  const onSubmitHandler = (e) => {
    e.preventDefault();
    const uploadForm = e.target;
    const fd = new FormData(uploadForm);
    fd.append("annotations-data", annotationFile, "annotationsFile.csv");
    fd.append("validations-data", validationsFile, "validationsFile.csv");

    setFileFormData(fd);
    setIsSubmit(true);
  };

  const onChangeAnnotationsFileInputHandler = (e) => {
    const file = e.target.files[0];

    setAnnotationFile(file);
  };

  const onChangeValidationsFileInputHandler = (e) => {
    //check which file
    const file = e.target.files[0];

    setValidationsFile(file);

    // if (e.target.id === "annotations-file") {
    //   setAnnotationFile(file);
    // } else {
    //   setValidationsFile(file);
    // }
  };

  const getAnnotationsFromServer = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/annotations",
      data: fileFormData,
    })
      .then((res) => {
        // console.log(JSON.stringify(res.data));
        //TODO: Handle error on this end
        // SET STATE: Set annotatedImagesArray and validationDataSetArray from the server response of no error
        // console.log(
        //   `From getAnnotationsFromServer (line 98) ${JSON.stringify(res.data)}`
        // );
        const returnData = res.data;
        setAnnotatedImagesArray([...returnData]);
      })
      .catch((err) => {
        console.log(err);
      });

    // setIsDataLoaded(true);
    // setValidationsFile({ hello: true });
    // TODO:
    // setIsDataLoaded(true);
  };

  const getValidationsFromServer = () => {
    axios({
      method: "post",
      url: "http://localhost:8000/validations",
      data: fileFormData,
    })
      .then((res) => {
        // TODO: Handle error on this end
        // console.log(
        //   `From getValidationsFromServer (line 121) ${JSON.stringify(res.data)}`
        // );
        const returnData = res.data;
        setValidationDataSetArray([...returnData]);
      })
      .catch((err) => {
        console.log(err);
      });

    // setIsDataLoaded(true);
    // setValidationsFile({ hello: true });
    // setIsDataLoaded(true);
  };

  const generateMissedDetectionsList = (
    _annotatedImagesArray,
    _validationDataSetArray,
    _setMissedDetections
  ) => {
    const missedDetectionsInstanceArray = _validationDataSetArray.filter(
      // We want to filter out (from the validation set) addresses that are not in the control array. These are the missedDetections
      (controlAddress) => {
        // Here we are formatting the filenames into nicely structured addresses: `${Street Address}.${Town}`
        const annotationFilenames = _annotatedImagesArray.map((roof) => {
          return roof.filename.replace(";", ".").replace(".png", "");
        });

        // Here we return our filter condition which is all controlAddresses that are not found in the annotationAddress.
        return !annotationFilenames.includes(controlAddress);
      }
    );
    /**
     * missedDetectionsInstanceArray = [
     *  '123 Oak St. Naugatuck',
     *  '4447 Byron Ave. Bronx',
     *  '40 Pleasant St. Lawrence'
     * ]
     */

    if (missedDetectionsInstanceArray === undefined) {
      setErrorMessage("missed detection array did not generate properly");
      return;
    }

    _setMissedDetections(missedDetectionsInstanceArray);
  };

  return (
    <>
      {errorMessage !== "" ? (
        <ErrorMessage
          show={showModal}
          setShow={setShowModal}
          handleShow={handleShow}
          handleClose={handleClose}
        >
          {errorMessage}
        </ErrorMessage>
      ) : null}
      <Container className="h-100 d-flex flex-column align-items-center">
        <h1>Object Detection Model Validator</h1>
        <Container className="d-flex flex-column justify-content-center align-items-center border mt-5 p-3">
          <Form
            className=" w-75"
            onSubmit={onSubmitHandler}
            encType="multipart/form-data"
            name="files-form"
          >
            <Form.Group controlId="annotations-file" className="mb-3">
              <Form.Label>Please select your annotations csv.</Form.Label>
              <Form.Control
                type="file"
                size="sm"
                onChange={onChangeAnnotationsFileInputHandler}
                required
              />
            </Form.Group>
            <Form.Group controlId="validation-file" className="mb-3">
              <Form.Label>Please select your validation csv.</Form.Label>
              <Form.Control
                type="file"
                size="sm"
                onChange={onChangeValidationsFileInputHandler}
                required
              />
            </Form.Group>
            <Button variant="success" type="submit">
              Continue with these files?
            </Button>
          </Form>
        </Container>
      </Container>
    </>
  );
};

export default UserInput;
