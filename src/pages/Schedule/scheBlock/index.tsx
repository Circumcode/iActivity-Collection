import { Component, ReactNode } from 'react';
import style from './index.module.scss';
import Sche from './sche';
import Activity from '../../../tools/Activity';
import WeatherAPIUtils from '../../../tools/WeatherAPIUtils';
import { getServers } from 'dns';

class scheDetail {
	uid: string;
	title: string;
	space: string;
	time: string;
	endTime: string;
	weather: string;
	eventStartTime: string;
	eventEndTime: string;

	constructor(uid: string, title: string, space: string, time: string, endTime: string, weather: string) {
		this.uid = uid;
		this.title = title;
		this.space = space;
		this.eventStartTime = time;
		this.eventEndTime = endTime;
		this.weather = weather;
		this.time = '0/0/0 0:0:0';
		this.endTime = '0/0/0 0:0:0';
	}
}

interface IProps {
	style: any;
}
interface IState {
	// scheDetails: Array<scheDetail>;
}

export default class ScheBlock extends Component<IProps, IState> {
    scheDetails: Array<scheDetail> = [];

	constructor(props: any) {
		super(props);
        this.setScheDetails();
	}
    componentDidMount() {
        this.scheDetails = this.setScheDetails();
    }

	cancel = (id: string) => {
		Activity.cancel(id);
	};

	setScheDetails(): Array<scheDetail> {
		let response = Activity.getReserved();
		let tempArray: Array<scheDetail> = [];
		for (let i = 0; i < response.length; i++) {
			let weather = '';
			let flag = true;
			let startTime = response[i].activity.showInfo[0].time;
			let endTime = response[i].activity.showInfo[0].endTime;
			WeatherAPIUtils.getByLocation(response[i].activity.showInfo[0].city, response[i].activity.showInfo[0].area).then(
				(data) => {
					if (data !== undefined) {
						for (let j = 0; j < data.length; j++) {
							let weatherStart = data[i].startTime.split(' ')[0].split('-');
							let weatherEnd = data[i].endTime.split(' ')[0].split('-');
							let eventTime = startTime.split(' ')[0].split('/');
							for (let index = 0; index < 3; index++) {
								if (
									Number(weatherStart[index]) <= Number(eventTime[index]) &&
									Number(weatherEnd[index]) >= Number(eventTime[index])
								)
									continue;
								else {
									flag = false;
									break;
								}
							}
							if (flag) weather = data[i].values.Wx;
						}
					}
					if (flag === false) weather = '尚未有天氣預報';

					tempArray.push(
						new scheDetail(
							response[i].activity.UID,
							response[i].activity.title,
							response[i].activity.showInfo[0].location,
							startTime,
							endTime,
							weather
						)
					);
				}
			);
		}
        return tempArray;
	}

	getSche() {
		let sches = [];
		for (let i = 0; i < this.scheDetails.length; i++) {
			sches[i] = <Sche {...this.scheDetails[i]} cancel={this.cancel} key={i} />;
		}
		return sches;
	}

	render(): ReactNode {
		return (
			<div className={style.scheblock} style={this.props.style}>
				{this.getSche()}
				<button className={style.cleantimeButton}>clean All</button>
			</div>
		);
	}
}
