import { Component, ReactNode } from 'react';
import style from './index.module.scss';
import Sche from './sche';
import Activity from '../../../tools/Activity';
import WeatherAPIUtils from '../../../tools/WeatherAPIUtils';
import { getServers } from 'dns';

import pubsub from 'pubsub-js'
// import calculateRouter from '../../../tools/ACO';
// import FunctionCaller from '../../../tools/FunctionCaller';
import { FUNCTION_CALLER_KEY_CALCULATE_ROUTER } from '../../../components/ActivityMap'


class scheDetail {
    uid: string;
    title: string;
    space: string;
    weather: string;
    startTime: string;
    endTime: string;

    constructor(uid: string, title: string, space: string, time: string, endTime: string, weather: string) {
        this.uid = uid;
        this.title = title;
        this.space = space;
        this.startTime = time;
        this.endTime = endTime;
        this.weather = weather;
    }
}

interface IProps {
    style: any;
}
interface IState {
    scheDetails: Array<scheDetail>,
    nowFocus: string,
};

export default class ScheBlock extends Component<IProps, IState> {
    constructor(props: any) {
        super(props);
        this.state = {
            scheDetails: [],
            nowFocus: "",
        }
    }

    componentDidMount() {
        this.setScheDetails();
    }

    cancel = (id: string) => {
        Activity.cancel(id);
        this.setScheDetails();
    }

    setScheDetails() {
        let newScheDetails: any = [];
        let response = Activity.getReserved();
        console.log(response);
        if (response.length != 0) {
            for (let i = 0; i < response.length; i++) {
                let weather = "";
                let flag = true;
                let startTime = response[i].activity.showInfo[0].time;
                WeatherAPIUtils.getByLocation(response[i].activity.showInfo[0].city, response[i].activity.showInfo[0].area)
                    .then((data) => {
                        if (data !== undefined) {
                            for (let j = 0; j < data.length; j++) {
                                let weatherStart = data[i].startTime.split(" ")[0].split("-");
                                let weatherEnd = data[i].endTime.split(" ")[0].split("-");
                                let eventTime = startTime.split(" ")[0].split("/");
                                for (let index = 0; index < 3; index++) {
                                    if (Number(weatherStart[index]) <= Number(eventTime[index]) &&
                                        Number(weatherEnd[index]) >= Number(eventTime[index])) continue;
                                    else {
                                        flag = false;
                                        break;
                                    }
                                }
                                if (flag) weather = data[i].values.Wx;
                            }
                        }
                        if (flag === false) weather = "尚未有天氣預報";

                        newScheDetails.push(new scheDetail(
                            response[i].activity.UID,
                            response[i].activity.title,
                            response[i].activity.showInfo[0].location,
                            (!response[i].dateStart) ? "" : response[i].dateStart?.toJSON().split('.')[0]!,
                            (!response[i].dateEnd) ? "" : response[i].dateEnd?.toJSON().split('.')[0]!,
                            weather))

                        if (newScheDetails != null) {
                            this.setState({
                                scheDetails: newScheDetails,
                            })
                        }
                    }).catch((error) => {
                        newScheDetails.push(new scheDetail(
                            response[i].activity.UID,
                            response[i].activity.title,
                            response[i].activity.showInfo[0].location,
                            (!response[i].dateStart) ? "" : response[i].dateStart?.toJSON().split('.')[0]!,
                            (!response[i].dateEnd) ? "" : response[i].dateEnd?.toJSON().split('.')[0]!,
                            "尚未有天氣預報"))

                        if (newScheDetails != null) {
                            this.setState({
                                scheDetails: newScheDetails,
                            })
                        }
                    })
            }
        } else {
            this.setState({
                scheDetails: newScheDetails,
            })
        }
    }

    click(uid: string) {
        this.setState({
            nowFocus: uid,
        })
    }

    clear() {
        Activity.setTime(this.state.nowFocus, "", "");
        console.log(123);
        this.setScheDetails();
    }

    clearAll() {
        Activity.clearTime();
        this.setScheDetails();
    }

    getSche() {
        let sches = [];
        for (let i = 0; i < this.state.scheDetails.length; i++) {
            sches[i] = <Sche {...this.state.scheDetails[i]}
                cancel={this.cancel}
                update={this.setScheDetails}
                click={this.click.bind(this)}
                key={this.state.scheDetails[i].uid} />
        }
        return sches;
    }

    render(): ReactNode {
        return (
            <div className={style.scheblock} style={this.props.style}>
                {this.getSche()}
                <button className={style.button} onClick={() => pubsub.publish(FUNCTION_CALLER_KEY_CALCULATE_ROUTER)}>輔助排程</button>
                <button className={style.cleanOneButton} onClick={this.clear.bind(this)}>clean focus</button>
                <button className={style.cleantimeButton} onClick={this.clearAll.bind(this)}>clean All</button>
            </div>
        )
    }
}
