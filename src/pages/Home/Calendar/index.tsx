import React, { Component } from 'react';
import style from './index.module.scss';

export default class index extends Component {
	render() {
		return (
			<div className={style.calendar}>
                <div className={style.years}>
                    <input type="button" value="<" />
                    <h5>&nbsp;2022&nbsp;</h5>
                    <input type="button" value=">" />
                </div>
                <br/>
				<div className={style.season}>
					<a href="#sesson0">1-3月</a>
					<a href="#sesson1">4-6月</a>
					<a href="#sesson2">7-9月</a>
					<a href="#sesson3">10-12月</a>
				</div>
			</div>
		);
	}
}
