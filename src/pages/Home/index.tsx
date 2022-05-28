import { memo } from 'react';

import style from './index.module.scss';

import Header from '../../components/Header'
import SlideShow from './slide/index.js';
import Calendar from './Calendar'
import ActivityBlock from './ActivityBlock';
import Footer from '../../components/Footer'


const HomePage = memo(() => {
	return (
		<div className={style.div}>
			<Header />

			<div className={style.slideShow}>
        		<SlideShow />
      		</div>

			<Calendar/>

			<ActivityBlock />

			<Footer />
		</div>
	);
});

export default HomePage;
