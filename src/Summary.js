const Summary = (props) => {
  // annotatedRoofs={annotatedRoofs}
  // controlArray={controlArray}
  // outputArray={outputArray}
  // getMissedDetections={getMissedDetections}

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
    //get num missed detections
    const numMissedDetections = props.getMissedDetections(
      annotatedRoofs,
      controlArray
    ).length;
    //get total number of damaged roofs in dataset
    const numDamagedRoofsInDataSet = controlArray.length;
    //create an object w info
    const totals = {
      numAnnotatedRoofs: numAnnotatedRoofs,
      numValid: numValid,
      numFalse: numFalse,
      numMissedDetections: numMissedDetections,
      numDamagedRoofsInDataSet: numDamagedRoofsInDataSet,
      //   percentValid: ((this.numValid / this.numAnnotatedRoofs) * 100).toFixed(2),
      //   percentFalse: ((this.numFalse / this.numAnnotatedRoofs) * 100).toFixed(2),
      //   percentDetected: (
      //     (this.numValid / this.numDamagedRoofsInDataSet) *
      //     100
      //   ).toFixed(2),
    };

    return totals;
  };

  const totals = getTotals(
    props.annotatedRoofs,
    props.controlArray,
    props.outputArray
  );
  const percentValid = (
    (totals.numValid / totals.numAnnotatedRoofs) *
    100
  ).toFixed(2);
  const percentFalse = (
    (totals.numFalse / totals.numAnnotatedRoofs) *
    100
  ).toFixed(2);
  const percentDetected = (
    (totals.numValid / totals.numDamagedRoofsInDataSet) *
    100
  ).toFixed(2);

  return (
    <>
      <h2>Totals</h2>
      <p>{`Number of Annotated Roofs: ${totals.numAnnotatedRoofs}`}</p>
      <p>{`Number of Valid Detections: ${totals.numValid}`}</p>
      <p>{`Number of False Positive Detections: ${totals.numFalse}`}</p>
      <p>{`Number of Missed Detections: ${totals.numMissedDetections}`}</p>
      <p>
        {`Number of Damaged Roofs in Control: ${totals.numDamagedRoofsInDataSet}
        `}
      </p>
      <hr />
      <hr />
      <p>{`${percentValid}% of Detections are Valid Detections`}</p>
      <p>{`${percentFalse}% of Detections are False Positives`}</p>
      <p>{`${percentDetected}% of Damaged Roofs Accurately Detected`}</p>
    </>
  );
};

export default Summary;
