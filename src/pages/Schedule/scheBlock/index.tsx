import { Component, ReactNode } from "react";
import style from './index.module.scss';
import Sche from './sche';
import Activity from '../../../tools/Activity';
import WeatherAPIUtils from "../../../tools/WeatherAPIUtils";


class scheDetail {
    uid: string;
    title: string;
    space: string;
    weather: string;
    startTime: string;
    endTime: string;

    constructor(uid: string, title: string, space: string, time: string, endTime: string, weather: string){
        this.uid = uid;
        this.title = title;
        this.space = space;
        this.startTime = time;
        this.endTime = endTime;
        this.weather = weather;
    }
}

interface IProps {
    style: any,
};
interface IState {
    scheDetails: Array<scheDetail>,
};

export default class ScheBlock extends Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state = {
            scheDetails: [],
        }
    }

    componentDidMount(){
        this.setScheDetails();
    }

    cancel = (id: string) => {
        Activity.cancel(id);
        this.setScheDetails();
    }

    setScheDetails(){
        let newScheDetails:any = [];
        let response = Activity.getReserved();
        if (response.length != 0){
            for (let i=0; i<response.length; i++){
                let weather = "";
                let flag = true;
                let startTime = response[i].activity.showInfo[0].time;
                let endTime = response[i].activity.showInfo[0].endTime;
                WeatherAPIUtils.getByLocation(response[i].activity.showInfo[0].city, response[i].activity.showInfo[0].area)
                .then((data) =>{
                    if (data !== undefined) {
                        for (let j=0; j<data.length; j++){
                            let weatherStart = data[i].startTime.split(" ")[0].split("-");
                            let weatherEnd = data[i].endTime.split(" ")[0].split("-");
                            let eventTime = startTime.split(" ")[0].split("/");
                            for (let index=0; index<3; index++){
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

                    console.log(response[i].dateStart);

                    newScheDetails.push(new scheDetail(
                        response[i].activity.UID,
                        response[i].activity.title,
                        response[i].activity.showInfo[0].location,
                        (!response[i].dateStart) ? "0000-00-00T00:00:00": String(response[i].dateStart),
                        (!response[i].dateEnd) ? "0000-00-00T00:00:00": String(response[i].dateEnd),
                        weather))

                    if (newScheDetails != null){
                        this.setState({
                            scheDetails: newScheDetails,
                        })
                    }
                }).catch((error)=>{
                    newScheDetails.push(new scheDetail(
                        response[i].activity.UID,
                        response[i].activity.title,
                        response[i].activity.showInfo[0].location,
                        (!response[i].dateStart) ? "0000-00-00T00:00:00": String(response[i].dateStart),
                        (!response[i].dateEnd) ? "0000-00-00T00:00:00": String(response[i].dateEnd),
                        "尚未有天氣預報"))

                    if (newScheDetails != null){
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

    getSche(){
        let sches = [];
        for (let i=0; i<this.state.scheDetails.length; i++){
            sches[i] = <Sche {...this.state.scheDetails[i]} cancel={this.cancel} update={this.setScheDetails} key={i}/>
        }
        return sches;
    }

    render(): ReactNode {
        return (
            <div className={style.scheblock} style={this.props.style}>
                {this.getSche()}
                <button className={style.cleantimeButton}>clean All</button>
            </div>
        )
    }
}



