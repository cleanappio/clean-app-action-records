
import './App.css';

//import React from "react";
//import ReactDOM from "react-dom/client"; // Use the new createRoot API
//import ActionTable from "./ActionTable"; // Your component

/*const root = ReactDOM.createRoot(document.getElementById("root")); // Ensure there's a div with id "root" in your HTML
root.render(<ActionTable />);
*/

import React from 'react';
//import ReactDOM from 'react-dom/client';
import ActionTable from './ActionTable';


//import {createRoot} from 'react-dom/client';
//const root = ReactDOM.createRoot(document.getElementById('root'));
//root.render(<ActionTable/>); 





const App = () => {
  return (
    <div>
      <h1>Action Records</h1>
      <ActionTable />
    </div>
  );
};




export default App;
