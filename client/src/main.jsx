


import React from 'react';
import ReactDOM  from "react-dom/client";
import './index.css';
import App from './App';


import axios from 'axios';

let url = 'http://localhost:8000';

axios.defaults.baseURL = url;
axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.common['Authorization'] = localStorage.getItem('JWT_PAYLOAD');

// ReactDOM.createRoot(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>,
//   document.getElementById('root')
// );

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    
      <App />
    
  </React.StrictMode>
);
