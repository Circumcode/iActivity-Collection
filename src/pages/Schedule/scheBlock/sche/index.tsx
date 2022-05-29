import { Component, ReactNode } from "react";
import style from './index.module.scss';
import Activity from "../../../../tools/Activity";
import 'antd/dist/antd.css';
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

const range = (start: number, end: number) => {
    const result = [];
    for (let i = start; i < end; i++) {
        result.push(i);
    }
    return result;
};

const disabledDate: RangePickerProps['disabledDate'] = current => {
// Can not select days before today and today
return current && (current > moment("20220620", "YYYYMMDD").add(1, 'days') ||  current < moment().endOf('day').subtract(1, "days"));
};

const disabledDateTime = () => ({
    disabledHours: () => range(0, 24).splice(4, 20),
    disabledMinutes: () => range(30, 60),
    disabledSeconds: () => [55, 56],
});


interface IProps {
    uid: string;
    title: string;
    space: string;
    weather: string;
    startTime: string;
    endTime: string;
    cancel: Function;
    update: Function;
}
// interface IState {
//     startTime: string;
//     endTime: string;
// }

export default class sche extends Component<IProps>{
    nowDatePicker: string = "startTime";
    startTime: string = "";
    endTime: string = "";
    // constructor(props: any){
    //     super(props);
    //     this.state = {
    //         startTime:  "",
    //         endTime: "",
    //     }
    // }
    
    

    handleClick(event: any){
        this.nowDatePicker = event.target.id;
        console.log(this.nowDatePicker);
    }

    dateChange = (event: any) =>{
        if(event){
            if (this.nowDatePicker == "startTime") {
                console.log("startTime");
                this.startTime = event.format();
            } else if (this.nowDatePicker == "endTime"){
                console.log("endTime");
                this.endTime = event.format();
            }
            console.log(this.startTime);
            console.log(this.endTime);
            Activity.setTime(this.props.uid, this.startTime, this.endTime);
        }
    }

    cancel(){
        this.props.cancel(this.props.uid);
    }    

    update(){
        this.props.update();
    }

    render(): ReactNode {
        return(
            <div className={style.sche}>
                <span className={`${style.scheTitle} ${style.sche_block}`}>{this.props.title}</span>
                <span className={style.line}></span>
                <span className={`${style.scheSpace} ${style.sche_block}`}>{this.props.space}</span>
                <span className={style.line}></span>
                <span className={`${style.scheDate} ${style.sche_block}`}>
                    {<DatePicker
                        onClick={this.handleClick.bind(this)}
                        id={"startTime"}
                        onChange={this.dateChange}
                        placement={"bottomLeft"}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        defaultValue={moment(this.props.startTime, "YYYY-MM-DDTHH:mm:ss")}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />}
                </span>
                <span className={style.split}>~</span>
                <span className={`${style.scheDate} ${style.sche_block}`}>
                    {<DatePicker
                        onClick={this.handleClick.bind(this)}
                        id={"endTime"}
                        onChange={this.dateChange}
                        placement={"bottomLeft"}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        defaultValue={moment(this.props.endTime, "YYYY-MM-DDTHH:mm:ss")}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />}
                </span>
                <span className={style.line}></span>
                <span className={`${style.scheWeather} ${style.sche_block}`}>{this.props.weather}</span>
                <span className={style.line}></span>
                <span className={`${style.cancel} ${style.sche_block}`} onClick={this.cancel.bind(this)}>x</span>
            </div>
        )
    }
}