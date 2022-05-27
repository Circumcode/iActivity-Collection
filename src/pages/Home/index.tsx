import { memo } from 'react';

import style from './index.module.scss';

import ActivityBlock from './ActivityBlock';

const HomePage = memo(() => {
	return (
		<div className={style.div}>
			<header className={style.header}>
				<img src={require('../../assets/titleBar.png')}></img>
			</header>
			<div className={style.slide}></div>
			<div className={style.calendar}></div>
			<ActivityBlock></ActivityBlock>
		</div>
	);
});

export default HomePage;
