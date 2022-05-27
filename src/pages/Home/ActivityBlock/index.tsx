import React, { PureComponent } from 'react';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './index.module.scss'

import ActivityCard from './ActivityCard';
import axios from 'axios';

class ActivityDetail {
	title: string;
	picLink: string;

	constructor(title: string, picLink: string) {
		this.title = title;
		this.picLink = picLink;
	}
}

interface IProps {}
interface IState {
	activityDetail: Array<ActivityDetail>;
}
export default class index extends PureComponent<IProps, IState> {
	url = 'https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json';

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
			tempArray.push(new ActivityDetail(response.data[index].title, response.data[index].imageUrl));
		}

		this.setState({ activityDetail: tempArray });
	};

	createActivity(): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];
		for (let index = 0; index < this.state.activityDetail.length; index += 3) {
			tempArray.push(<div key={index} className={style.Row}>{this.addCol(index)}</div>);
		}
		return tempArray;
	}
	private addCol(index: number): Array<JSX.Element> {
		let tempArray: Array<JSX.Element> = [];
		for (let i = 0; i < 3; i++) {
			if (index === this.state.activityDetail.length) break;

			tempArray.push(
				<div key={index} className={style.Col}>
					<ActivityCard
						key={index}
						title={this.state.activityDetail[index].title}
						picLink={this.state.activityDetail[index].picLink}
					></ActivityCard>
				</div>
			);
			index++;
		}
		return tempArray;
	}

	render() {
		return (
			<>
				<div className={style.activity}>{this.createActivity()}</div>
				<div className={style.aside}>
					<div className={style.dateBlock}></div>
				</div>
			</>
		);
	}
}
