import Table from "react-bootstrap/Table";

const MissedDetections = (props) => {
  const missedDetections = props.getMissedDetections(
    props.annotatedRoofs,
    props.controlArray
  );

  return (
    <Table>
      <thead>
        <tr>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {missedDetections.map((roof) => {
          return (
            <tr key={roof}>
              <td>{roof}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default MissedDetections;
