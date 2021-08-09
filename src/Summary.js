import { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
const Summary = (props) => {
  const [totals, setTotals] = useState({});
  const [percentValid, setPercentValid] = useState(0);
  const [percentFalse, setPercentFalse] = useState(0);
  const [percentDetected, setPercentDetected] = useState(0);

  useEffect(() => {
    // console.log(
    //   `annotatedRoofs from <Summary> useEffect: ${props.annotatedRoofs}`
    // );
    // console.log(`controlArray from <Summary> useEffect: ${props.controlArray}`);
    // console.log(`outputArray from <Summary> useEffect: ${props.outputArray}`);

    const totals = getTotals(
      props.annotatedRoofs,
      props.controlArray,
      props.outputArray
    );
    setTotals({ ...totals });

    const percentValid = getPercentValid(totals);
    setPercentValid(percentValid);

    const percentFalse = getPercentFalse(totals);
    setPercentFalse(percentFalse);

    const percentDetected = getPercentDetected(totals);
    setPercentDetected(percentDetected);
  }, [props.annotatedRoofs, props.controlArray, props.outputArray]);

  const getTotals = (annotatedRoofs, controlArray, outputArray) => {
    // get total num of annotated roofs
    const numAnnotatedRoofs = annotatedRoofs.length;
    // get num valid annotations
    const numValid = outputArray.filter((roof) => {
      return roof.status;
    }).length;
    // get num false positives
    const numFalse = outputArray.filter((roof) => {
      return !roof.status;
    }).length;
    //get num missed detections from state
    const numMissedDetections = props.numMissedDetections;
    //get total number of damaged roofs in dataset
    const numDamagedRoofsInDataSet = controlArray.length;
    //create an object w info
    const totals = {
      numAnnotatedRoofs: numAnnotatedRoofs,
      numValid: numValid,
      numFalse: numFalse,
      numMissedDetections: numMissedDetections,
      numDamagedRoofsInDataSet: numDamagedRoofsInDataSet,
    };

    return totals;
  };

  const getPercentValid = (totals) => {
    return ((totals.numValid / totals.numAnnotatedRoofs) * 100).toFixed(2);
  };

  const getPercentFalse = (totals) => {
    return ((totals.numFalse / totals.numAnnotatedRoofs) * 100).toFixed(2);
  };

  const getPercentDetected = (totals) => {
    return ((totals.numValid / totals.numDamagedRoofsInDataSet) * 100).toFixed(
      2
    );
  };

  return (
    <>
      <Card>
        <Card.Body>
          <Card.Title>Totals</Card.Title>
          <p>{`Number of Annotated Roofs: ${totals.numAnnotatedRoofs}`}</p>
          <p>{`Number of Valid Detections: ${totals.numValid}`}</p>
          <p>{`Number of False Positive Detections: ${totals.numFalse}`}</p>
          <p>{`Number of Missed Detections: ${totals.numMissedDetections}`}</p>
          <p>
            {`Number of Damaged Roofs in Control: ${totals.numDamagedRoofsInDataSet}
        `}
          </p>
        </Card.Body>
      </Card>
      <Card>
        <Card.Body>
          <Card.Title>Model Score</Card.Title>
          <p>{`${percentValid}% of Detections are Valid Detections`}</p>
          <p>{`${percentFalse}% of Detections are False Positives`}</p>
          <Alert variant={percentDetected > 70 ? "success" : "warning"}>
            {`${percentDetected}% of Damaged Roofs Accurately Detected`}
          </Alert>
          <Alert variant={percentDetected > 70 ? "success" : "warning"}>
            {percentDetected > 70
              ? "This model is pretty good."
              : "This model kinda sucks."}
          </Alert>
        </Card.Body>
      </Card>
    </>
  );
};

export default Summary;
