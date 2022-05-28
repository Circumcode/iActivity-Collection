import React, { Component } from 'react';

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
interface IState {
	isChange: boolean
}
export default class index extends Component<IProps, IState> {
	url: string = 'https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json';
	arrSpring: Array<ActivityDetail>;
	arrSummer: Array<ActivityDetail>;
	arrFall: Array<ActivityDetail>;
	arrWinter: Array<ActivityDetail>;
	mapIsReserve: {[key: string]: boolean} = {};

	constructor(props: any) {
		super(props);

		this.arrSpring = this.getDetail('spring');
		this.arrSummer = this.getDetail('summer');
		this.arrFall = this.getDetail('fall');
		this.arrWinter = this.getDetail('winter');

		this.state = {
			isChange: false
		}

		this.getDetail = this.getDetail.bind(this);
		this.toBlock = this.toBlock.bind(this);
	}

	getDetail(strSeason: 'spring' | 'summer' | 'fall' | 'winter') {
		let tempArray = [];
		let arrSeason = Activity.getBySeason(2022, strSeason);
		for (let index in arrSeason) {
			if (this.mapIsReserve[arrSeason[index].UID] === undefined) {
				this.mapIsReserve[arrSeason[index].UID] = Activity.isReserved(arrSeason[index].UID);
			} else {
				this.mapIsReserve[arrSeason[index].UID] =
				 this.mapIsReserve[arrSeason[index].UID] && Activity.isReserved(arrSeason[index].UID);
			}

			tempArray.push(
				new ActivityDetail(arrSeason[index].UID, arrSeason[index].title, strSeason, arrSeason[index].imageUrl, false)
			);
		}

		return tempArray;
	}

	toBlock() {
		this.setState({isChange: true});
	}

	createActivity(): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];

		tempArray = this.findAllSeason(tempArray, this.arrSpring, 'spring');
		tempArray = this.findAllSeason(tempArray, this.arrSummer, 'summer');
		tempArray = this.findAllSeason(tempArray, this.arrFall, 'fall');
		tempArray = this.findAllSeason(tempArray, this.arrWinter, 'winter');

		return tempArray;
	}
	private findAllSeason(tempArray: Array<JSX.Element>, arrSeason: Array<ActivityDetail>, season: 'spring' | 'summer' | 'fall' | 'winter'): Array<JSX.Element> {
		for (let index = 0; index < arrSeason.length; index += 3) {
			tempArray.push(
				<div key={season + index} className={style.Row}>
					{this.addCol(index, season, arrSeason)}
				</div>
			);
		}
		if (arrSeason.length === 0) {
			tempArray.push(<div key={season + 0} className={style.Row}>
								<div className={style.block}><h1>Coming Soon...</h1></div>
								{this.addCol(0, season, arrSeason)}
							</div>)
		}
		return tempArray;
	}
	private addCol(index: number,strSeason: 'spring' | 'summer' | 'fall' | 'winter',arrSeason: Array<ActivityDetail>): Array<JSX.Element> {
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
							isReserve={Activity.isReserved(arrSeason[index + i].id)}
							isOverTime={arrSeason[index + i].isOverTime}
							toBlock={this.toBlock}
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
			<div className={style.activityList}>{this.createActivity()}</div>
		);
	}
}
