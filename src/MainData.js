// import { useState, useEffect } from "react";
import Table from "react-bootstrap/Table";

const MainData = (props) => {
  //   useEffect(() => {
  //     createOutputArray(props.annotatedRoofs);
  //   }, [props.annotatedRoofs]);

  return (
    <Table striped hover bordered>
      <thead>
        <tr>
          <th>Address</th>
          <th>Town</th>
          <th># Missing Shingles</th>
          <th>Average Score</th>
          <th># Patches</th>
          <th>Average Score</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {props.outputArray.map((roof) => {
          return (
            <tr key={roof.address}>
              <td>{roof.address}</td>
              <td>{roof.town}</td>
              <td>{roof.numMissingShingles}</td>
              <td>{roof.avgScoreMissingShingles}</td>
              <td>{roof.numPatches}</td>
              <td>{roof.avgScorePatches}</td>
              <td>{props.statusAlertHandler(roof)}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default MainData;
