import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Activity from './pages/Activity';
import Schedule from './pages/Schedule';
import NotMatch from './pages/NotMatch';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/activity' element={<Activity />}></Route>
        <Route path='/schedule' element={<Schedule />}></Route>
        <Route path='*' element={<NotMatch />}></Route>
      </Routes>
    </Router>
  );
}

export default App;







