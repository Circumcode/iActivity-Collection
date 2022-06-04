import { memo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import classActivity from '../../tools/Activity';
import Activity, { NotExistActivity } from '../../components/Activity';
import { HeaderNoScheduleIcon } from '../../components/Header';
import Footer from '../../components/Footer';


const ActivityPage = memo(() => {
  const location = useLocation();
  const strActivityId = location.pathname.split("/")[2];
  const activity = classActivity.get(strActivityId, false);


  return (
    <>
      <HeaderNoScheduleIcon />
        {(activity == null)? <NotExistActivity /> : <Activity activity={classActivity.get(strActivityId)} />}
      <Footer />
    </>
  )
})

export default ActivityPage;