import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import classActivity from './tools/Activity';

import Loading from './components/Loading';
import CheckWindowWidth from './components/CheckWindowWidth';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import Activity from './pages/Activity';
import Schedule from './pages/Schedule';
import LoadingPage from './pages/Loading';
import Warning from './pages/Warning';
import NotMatch from './pages/NotMatch';


function App() {
  const [isLoaded, setLoadedState] = useState(classActivity.isLoaded());


  return (
    <Router>
      {(isLoaded)? <></> : <Loading setLoadedState={setLoadedState} />}
      {(process.env.NODE_ENV === "development")? <></> : <CheckWindowWidth /> /* 清除 *//* 清除 *//* 清除 *//* 清除 *//* 清除 *//* 清除 *//* 清除 *//* 清除 *//* 清除 *//* 清除 */}
      <ScrollToTop />

      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/activity/*' element={<Activity />}></Route>
        <Route path='/schedule' element={<Schedule />}></Route>
        <Route path='/loading' element={<LoadingPage />}></Route>
        <Route path='/warning' element={<Warning />}></Route>
        <Route path='*' element={<NotMatch />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
