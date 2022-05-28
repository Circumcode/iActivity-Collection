import React, { PureComponent } from 'react';
import axios from 'axios';

import style from './index.module.scss'

import ActivityCard from './ActivityCard';


class ActivityDetail {
	id: string;
	title: string;
	date: number;
	picLink: string;
	isOverTime: boolean;

	constructor(id: string, title: string, date: number, picLink: string, isOverTime: boolean) {
		this.id = id;
		this.title = title;
		this.date = date;
		this.picLink = picLink;
		this.isOverTime = isOverTime;
	}
}

interface IProps {}
interface IState {
	activityDetail: Array<ActivityDetail>;
}
export default class index extends PureComponent<IProps, IState> {
	index: number = 0;
	isSesson: Array<boolean> = [false, false, false, false];
	url: string = 'https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json';

	constructor(props: any) {
		super(props);
		this.state = {
			activityDetail: [],
		};
	}

	componentDidMount(): void {
		this.getDetail();
	}

	getDetail = async () => {
		let tempArray = [];

		let response = await axios.get(this.url);
		for (let index in response.data) {
			tempArray.push(new ActivityDetail(response.data[index].UID, response.data[index].title, parseInt(index) + 1, response.data[index].imageUrl, false));
		}
		tempArray[3].date = 3;
		tempArray[0].isOverTime = true;
		tempArray[1].isOverTime = true;
		tempArray[2].isOverTime = true;

		this.setState({ activityDetail: tempArray });
	};

	createActivity(): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];
		for (this.index; this.index < this.state.activityDetail.length;) {
			tempArray.push(<div key={this.index} className={style.Row}>{this.addCol(-1)}</div>);
		}

		if (this.state.activityDetail.length !== 0) {
			for (let sesson in this.isSesson) {
				if (!this.isSesson[sesson]) tempArray.push(<div key={this.index} className={style.Row}>{this.addCol(parseInt(sesson))}</div>);
			}
		}

		return tempArray;
	}
	private addCol(unGetSesson: number): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];
		let isNewSesson: boolean = false;
		let intSesson: number = (this.state.activityDetail[this.index]) 
								? Math.floor((this.state.activityDetail[this.index].date - 1) / 3)
								: unGetSesson;

		if (!this.isSesson[intSesson]) {
			this.isSesson[intSesson] = true;
			isNewSesson = true;
		}
		for (let i = 0; i < 3; i++) {
			if (this.index >= this.state.activityDetail.length || Math.floor((this.state.activityDetail[this.index].date - 1) / 3) !== intSesson) {
				tempArray.push(
					<div key={this.index + " " + i} className={style.Col}></div>
				);
				this.index--;
			} else {
				tempArray.push(
					<div key={this.index} className={style.Col} style={(isNewSesson) ? {marginTop: '60px'} : {}}>
						<ActivityCard
							key={this.index}
							id={this.state.activityDetail[this.index].id}
							title={this.state.activityDetail[this.index].title}
							picLink={this.state.activityDetail[this.index].picLink}
							isOverTime={this.state.activityDetail[this.index].isOverTime}
						></ActivityCard>
					</div>
				);
			}
			this.index++;
		}

		if (isNewSesson) {
			let sesson: string = '';
			switch (intSesson){
				case 0:
					sesson = '1 - 3月';
					break;
				case 1:
					sesson = '4 - 6月';
					break;
				case 2:
					sesson = '7 - 9月';
					break;
				case 3:
					sesson = '10 - 12月';
					break;
			}

			tempArray.push(
				<a id={'sesson' + intSesson} className={style.targetFix}></a>
			);
			tempArray.push(
				<div key={intSesson + ' ' + index} className={style.dateBlock}><h2>{sesson}</h2></div>
			);
		} else {
			tempArray.push(
				<div key={intSesson + ' ' + index} className={style.dateBlock} style={{border: 'none'}}></div>
			);
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
