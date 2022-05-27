import { memo } from 'react';

import style from './index.module.scss';

import ActivityBlock from './ActivityBlock';

import SlideShow from './slide/index.js';


const HomePage = memo(() => {
	return (
		<div className={style.div}>
			<header className={style.header}>
				<img src={require('../../assets/titleBar.png')}></img>
			</header>
			<div className={style.slideShow}>
        		<SlideShow></SlideShow>
      		</div>
			<div className={style.calendar}></div>
			<ActivityBlock></ActivityBlock>
		</div>
	);
});

export default HomePage;
