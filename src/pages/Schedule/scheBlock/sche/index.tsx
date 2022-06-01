import { Component, CSSProperties, ReactNode } from "react";
import style from './index.module.scss';
import Activity from "../../../../tools/Activity";
import './antd.css';
import moment from 'moment';
import { DatePicker, Space } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';
import pubsub from 'pubsub-js'


interface IProps {
    isFocus: boolean;

    uid: string;
    title: string;
    space: string;
    weather: string;
    startTime: string;
    endTime: string;
    cancel: Function;
    update: Function;
    click: Function;
    eventStart: string;
    eventEnd: string;
}
interface IState {
    startTime: string | undefined;
    endTime: string | undefined;
    nowDatePicker: string;
}

export default class sche extends Component<IProps, IState>{
    constructor(props: any){
        super(props);
        this.state = {
            startTime: this.props.startTime,
            endTime: this.props.endTime,
            nowDatePicker: "",
        }
        pubsub.subscribe("clear_"+this.props.uid, this.clear.bind(this));
    }

    clear(){
        this.setState({
            startTime: "",
            endTime: "",
        })
    }

    cancel(){
        this.props.cancel(this.props.uid);
    }

    click(){
        this.props.click(this.props.uid);
    }

    clickStart(){
        this.setState({
            nowDatePicker: "startTime",
        })
    }

    clickEnd(){
        this.setState({
            nowDatePicker: "endTime",
        })
    }

    range = (start: number, end: number) => {
        const result = [];
        for (let i = start; i < end; i++) {
            result.push(i);
        }
        return result;
    };
    
    disabledStartDate: RangePickerProps['disabledDate'] = current => {
        return current < moment()
            || current > moment(this.state.endTime, "YYYY-MM-DD HH:mm:ss").add(1, "days")
            || current > moment(this.props.eventEnd, "YYYY-MM-DD HH:mm:ss")
            || current < moment(this.props.eventStart, "YYYY-MM-DD HH:mm:ss");
    };

    disabledEndDate: RangePickerProps['disabledDate'] = current => {
        return current < moment()
            || current < moment(this.state.startTime, "YYYY-MM-DD HH:mm:ss").subtract(1, "days")
            || current > moment(this.props.eventEnd, "YYYY-MM-DD HH:mm:ss")
            || current < moment(this.props.eventStart, "YYYY-MM-DD HH:mm:ss");
    };
    
    disabledDateTime = () => ({
        // [0, 1, 2, 3, 4, 5, 23]
        disabledHours: () => this.range(0, 0),
        disabledMinutes: () => this.range(0, 0),
        disabledSeconds: () => this.range(0, 0),
    });

    dateChange = (event: any) =>{
        if (!event) return
        let time = event.format().split("+")[0];
        console.log(time);
        if (this.state.nowDatePicker === "startTime") {
            this.setState({startTime: time})
        } else if (this.state.nowDatePicker === "endTime") {
            this.setState({endTime: time})
        }
        setTimeout(()=>{
            Activity.setTime(this.props.uid, this.state.startTime!, this.state.endTime!);
            this.props.update();
            console.log(this.state.startTime);
            console.log(event.format());
        }, 200)
    }    

    render(): ReactNode {
        const cssBackgroundColor: CSSProperties = {
            backgroundColor: "#e0f3ff"
        }
        return(
            <div style={(this.props.isFocus)? cssBackgroundColor : undefined} 
                className={style.sche} 
                onClick={this.click.bind(this)}
            >
                <span className={`${style.scheTitle} ${style.sche_block}`}>{this.props.title}</span>
                <span className={style.line}></span>
                <span className={`${style.scheSpace} ${style.sche_block}`}>{this.props.space}</span>
                <span className={style.line}></span>
                <span className={`${style.scheDate} ${style.sche_block}`}
                    onClick={this.clickStart.bind(this)}
                >
                    {<DatePicker
                        key={"startTime_"+this.props.uid}
                        id={"startTime"}
                        onChange={this.dateChange}
                        placement={"bottomLeft"}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={this.disabledStartDate}
                        disabledTime={this.disabledDateTime}
                        value={(this.state.startTime !== "" ? moment(this.state.startTime, "YYYY-MM-DD HH:mm:ss") : null)}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />}
                </span>
                <span className={style.split}>~</span>
                <span className={`${style.scheDate} ${style.sche_block}`}
                    onClick={this.clickEnd.bind(this)}
                >
                    {<DatePicker
                        key={"endTime_"+this.props.uid}
                        id={"endTime"}
                        onChange={this.dateChange.bind(this)}
                        placement={"bottomLeft"}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={this.disabledEndDate}
                        disabledTime={this.disabledDateTime}
                        value={(this.state.endTime !== "" ? moment(this.state.endTime, "YYYY-MM-DD HH:mm:ss") : null)}
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