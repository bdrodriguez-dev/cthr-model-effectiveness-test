const MissedDetections = (props) => {
  const getMissedDetections = (annotatedRoofs, controlArray) => {
    const missedDetections = props.controlArray.filter((controlAddress) => {
      return !annotatedRoofs.includes(controlAddress);
    });

    return missedDetections;
  };

  return <p>Missed Detections</p>;
};

export default MissedDetections;
