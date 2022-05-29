import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import style from './index.module.scss';
import calendar from '../../assets/icon/calendar.svg'

export default class index extends Component {
	render() {
		return (
			<header className={style.header}>
				<Link to="/">
					<img className={style.logo} src={require('../../assets/logo.png')}></img>
				</Link>

				<div className={style.rightLink}>
					<Link to="/schedule">
						
						<img src={calendar}></img>
						<input type="button" className={style.btn} value="自訂行程" />
					</Link>
				</div>
			</header>
		);
	}
}

export class HeaderEmpty extends Component {
	render() {
		return (
			<header className={style.header}>
				<Link to="/">
					<img className={style.logo} src={require('../../assets/logo.png')}></img>
				</Link>
			</header>
		);
	}
}