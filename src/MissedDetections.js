import Table from "react-bootstrap/Table";

const MissedDetections = (props) => {
  return (
    <Table>
      <thead>
        <tr>
          <th>Address</th>
        </tr>
      </thead>
      <tbody>
        {props.missedDetections.map((roof) => {
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
