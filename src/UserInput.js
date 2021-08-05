import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import axios from "axios";

const UserInput = (props) => {
  // Annotation and Validation Files
  const [annotationFile, setAnnotationFile] = useState({});
  const [validationsFile, setValidationsFile] = useState({});
  // FormData with above
  const [fileFormData, setFileFormData] = useState([]);
  // Form
  const [uploadForm, setUploadForm] = useState({});
  // Flags
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);
  // Arrays that will be used to render MainData component
  const [annotatedImagesArray, setAnnotatedImagesArray] = useState([]);
  const [validationDataSetArray, setValidationDataSetArray] = useState([]);

  useEffect(() => {
    if (isSubmit === true) {
      // send post request
      axios({
        method: "post",
        url: "http://localhost:8000/",
        data: fileFormData,
      })
        .then((res) => {
          // if (typeof res.data === 'string')
          // setAnnotatedImagesArray(res.annotatedImagesArray);
          // setValidationDataSetArray(res.validationDataSetArray);
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
        });

      setIsLoading(true);
    }
  }, [isSubmit]);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    console.log(annotationFile, validationsFile);
    const fd = new FormData(uploadForm);
    fd.append("annotations-data", annotationFile, "annotationsFile.csv");
    fd.append("validations-data", validationsFile, "validationsFile.csv");

    setFileFormData(fd);
    setIsSubmit(true);
  };

  const onChangeFileHandler = (e) => {
    //check which file
    const file = e.target.files[0];
    if (e.target.id === "annotations-file") {
      setAnnotationFile(file);
    } else {
      setValidationsFile(file);
    }
    // console.log(e.target);
    // console.log(e.target.form);
    setUploadForm(e.target.form);
  };
  return (
    <>
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
                onChange={onChangeFileHandler}
                required
              />
            </Form.Group>
            <Form.Group controlId="validation-file" className="mb-3">
              <Form.Label>Please select your validation csv.</Form.Label>
              <Form.Control
                type="file"
                size="sm"
                onChange={onChangeFileHandler}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Container>
      </Container>
    </>
  );
};

export default UserInput;
