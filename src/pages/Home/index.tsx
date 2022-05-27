import { memo } from 'react';

import style from './index.module.scss';

import Header from '../../components/Header'
import ActivityBlock from './ActivityBlock';

import SlideShow from './slide/index.js';


const HomePage = memo(() => {
	return (
		<div className={style.div}>
			<div><Header></Header></div>
			

			<div className={style.slideShow}>
        		<SlideShow></SlideShow>
      		</div>

			<div className={style.calendar}></div>
			<ActivityBlock></ActivityBlock>
		</div>
	);
});

export default HomePage;
