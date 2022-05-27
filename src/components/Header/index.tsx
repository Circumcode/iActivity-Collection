import React, { Component } from 'react';

import style from './index.module.scss';

export default class index extends Component {
	render() {
		return (
			<div className={style.header}>
				{/* <img className={style.logo} src={require('../../../assets/logo.png')}></img> */}
				<img className={style.logo} src={require('../../assets/logo512.png')}></img>
				<h4>&nbsp;IACTIVITY COLLECTION</h4>

				<div className={style.rightDiv}>
					<img src={require('../../assets/calendar.png')}></img>
					<input type="button" className={style.btn} value="自訂行成" />
				</div>
			</div>
		);
	}
}
