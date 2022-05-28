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
					<a href="#spring">1-3月</a>
					<a href="#summer">4-6月</a>
					<a href="#fall">7-9月</a>
					<a href="#winter">10-12月</a>
				</div>
			</div>
		);
	}
}
