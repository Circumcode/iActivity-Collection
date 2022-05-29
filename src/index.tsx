import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

import fun from './tools/ACO'
import ActivityUtils from './tools/Activity'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <App />
);

setTimeout(()=>{
  let reservedActivity = ActivityUtils.getReserved()
  let result = fun(reservedActivity, 1)
}, 5000)
