// const MainData = (props) => {
//     return (
//         <Card body style={{ width: "50rem", margin: "0 auto" }}>
//           <Table striped hover bordered>
//             <thead>
//               <tr>
//                 <th>Address</th>
//                 <th>Town</th>
//                 <th># Missing Shingles</th>
//                 <th>Average Score</th>
//                 <th># Patches</th>
//                 <th>Average Score</th>
//               </tr>
//             </thead>
//             <tbody>
//               {annotatedRoofs.map((roof) => {
//                 return (
//                   <tr>
//                     <td>{getAddress(roof)}</td>
//                     <td>{getTown(roof)}</td>
//                     <td>{getNumMissingShingles(roof)}</td>
//                     <td>{getAverageScore(roof, "missing-shingles")}</td>
//                     <td>{getNumPatches(roof)}</td>
//                     <td>{getAverageScore(roof, "patches")}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </Table>
//         </Card>
//       );
// };

// export default MainData;
