import React, { PureComponent } from 'react';
import axios from 'axios';

import style from './index.module.scss';

import ActivityCard from './ActivityCard';

import Activity from '../../../tools/Activity';

class ActivityDetail {
	id: string;
	title: string;
	date: string;
	picLink: string;
	isOverTime: boolean;

	constructor(id: string, title: string, date: string, picLink: string, isOverTime: boolean) {
		this.id = id;
		this.title = title;
		this.date = date;
		this.picLink = picLink;
		this.isOverTime = isOverTime;
	}
}

interface IProps {}
interface IState {}
export default class index extends PureComponent<IProps, IState> {
	url: string = 'https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json';
	arrSpring: Array<ActivityDetail> = this.getDetail('spring');
	arrSummer: Array<ActivityDetail> = this.getDetail('summer');
	arrFall: Array<ActivityDetail> = this.getDetail('fall');
	arrWinter: Array<ActivityDetail> = this.getDetail('winter');
	mapIsReserve: {[key: string]: boolean} = {}

	constructor(props: any) {
		super(props);
	}

	getDetail(strSeason: 'spring' | 'summer' | 'fall' | 'winter') {
		let tempArray = [];
		let arrSeason = Activity.getBySeason(2022, strSeason);
		for (let index in arrSeason) {
			
			tempArray.push(
				new ActivityDetail(arrSeason[index].UID, arrSeason[index].title, strSeason, arrSeason[index].imageUrl, false)
			);
		}

		return tempArray;
	}

	createActivity(): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];

		for (let index = 0; index < this.arrSpring.length; index += 3) {
			tempArray.push(
				<div key={'spring' + index} className={style.Row}>
					{this.addCol(index, 'spring', this.arrSpring)}
				</div>
			);
		}
		for (let index = 0; index < this.arrSummer.length; index += 3) {
			tempArray.push(
				<div key={'summer' + index} className={style.Row}>
					{this.addCol(index, 'summer', this.arrSummer)}
				</div>
			);
		}
		for (let index = 0; index < this.arrFall.length; index += 3) {
			tempArray.push(
				<div key={'fall' + index} className={style.Row}>
					{this.addCol(index, 'fall', this.arrFall)}
				</div>
			);
		}
		for (let index = 0; index < this.arrWinter.length; index += 3) {
			tempArray.push(
				<div key={'winter' + index} className={style.Row}>
					{this.addCol(index, 'winter', this.arrWinter)}
				</div>
			);
		}

		return tempArray;
	}
	private addCol(
		index: number,
		strSeason: 'spring' | 'summer' | 'fall' | 'winter',
		arrSeason: Array<ActivityDetail>
	): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];

		for (let i = 0; i < 3; i++) {
			if (index + i >= arrSeason.length) {
				tempArray.push(<div key={strSeason + index + i} className={style.Col}></div>);
			} else {
				tempArray.push(
					<div key={index + i} className={style.Col} style={index === 0 ? { marginTop: '60px' } : {}}>
						<ActivityCard
							key={index + i}
							id={arrSeason[index + i].id}
							title={arrSeason[index + i].title}
							picLink={arrSeason[index + i].picLink}
							isReserve={false}
							isOverTime={arrSeason[index + i].isOverTime}
						></ActivityCard>
					</div>
				);
			}
		}

		if (index === 0) {
			let season: string = '';
			switch (strSeason) {
				case 'spring':
					season = '1 - 3月';
					break;
				case 'summer':
					season = '4 - 6月';
					break;
				case 'fall':
					season = '7 - 9月';
					break;
				case 'winter':
					season = '10 - 12月';
					break;
			}

			tempArray.push(<a id={strSeason} key={strSeason + ' a'} className={style.targetFix}></a>);
			tempArray.push(
				<div key={strSeason} className={style.dateBlock}>
					<h2>{season}</h2>
				</div>
			);
		} else {
			tempArray.push(<div key={strSeason + ' ' + index} className={style.dateBlock} style={{ height: 'auto', border: 'none' }}></div>);
		}

		return tempArray;
	}

	render() {
		return (
			<>
				<div className={style.activityList}>{this.createActivity()}</div>
			</>
		);
	}
}
