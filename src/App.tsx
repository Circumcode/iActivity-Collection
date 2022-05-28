import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import classActivity from './tools/Activity';

import Home from './pages/Home';
import Activity from './pages/Activity';
import Schedule from './pages/Schedule';
import NotMatch from './pages/NotMatch';
import LoadingPage from './pages/Loading';
import Loading from './components/Loading'


function App() {
  const [isLoaded, setLoadedState] = useState(classActivity.isLoad());


  return (
    <Router>
      {(isLoaded)? <></> : <Loading setLoadedState={setLoadedState} />}

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/activity/*' element={<Activity />}></Route>
        <Route path='/schedule' element={<Schedule />}></Route>
        <Route path='/loading' element={<LoadingPage />}></Route>
        <Route path='*' element={<NotMatch />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
