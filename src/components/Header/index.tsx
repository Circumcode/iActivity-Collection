import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import style from './index.module.scss';

export default class index extends Component {
	render() {
		return (
			<header className={style.header}>
				<Link
					to='/'
				>
					<img className={style.logo} src={require('../../assets/logo.png')}></img>
				</Link>

				<Link
					to='/schedule'
					className={style.rightLink}
				>
					<img src={require('../../assets/icon/calendar.png')}></img>
					<input type="button" className={style.btn} value="自訂行程" />

				</Link>
			</header>
		);
	}
}
