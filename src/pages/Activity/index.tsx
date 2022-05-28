import { memo } from 'react';
import { useLocation } from 'react-router-dom';

import Activity, { NotExistActivity } from '../../components/Activity';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

import classActivity from '../../tools/Activity';//


const parsePathName: Function = () => {
  return window.location.pathname.split("/")[2];
}

const ActivityPage = memo(() => {
  const location = useLocation();
  const strActivityId = location.pathname.split("/")[2];
  const activity = classActivity.get(strActivityId);


  return (
    <>
      <Header />
      {(activity == null)? <NotExistActivity /> : <Activity activity={classActivity.get(strActivityId)} />}
      <Footer />
    </>
  )
})

export default ActivityPage;