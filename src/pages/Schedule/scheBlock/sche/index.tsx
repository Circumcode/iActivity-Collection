import { Component, CSSProperties, ReactNode } from "react";
import style from './index.module.scss';
import Activity from "../../../../tools/Activity";
import './antd.css';
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
}
interface IState {
    startTime: string;
    endTime: string;
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

    dateChange = (event: any) =>{
        if(event){
            console.log(event.format().split('+')[0]);
            if (this.state.nowDatePicker === "startTime") {
                this.setState({startTime: event.format().split('+')[0]})
            } else if (this.state.nowDatePicker === "endTime"){
                this.setState({endTime: event.format().split('+')[0]})
            }
            setTimeout(()=>{
                Activity.setTime(this.props.uid, this.state.startTime, this.state.endTime);
            }, 500)
        }
    }

    cancel(){
        this.props.cancel(this.props.uid);
    }    

    update(){
        this.props.update();
    }

    render(): ReactNode {
        const cssBackgroundColor: CSSProperties = {
            backgroundColor: "#e0f3ff"
        }
        return(
            <div style={(this.props.isFocus)? cssBackgroundColor : undefined} className={style.sche} onClick={this.click.bind(this)}>
                <span className={`${style.scheTitle} ${style.sche_block}`}>{this.props.title}</span>
                <span className={style.line}></span>
                <span className={`${style.scheSpace} ${style.sche_block}`}>{this.props.space}</span>
                <span className={style.line}></span>
                <span className={`${style.scheDate} ${style.sche_block}`}
                    onClick={this.clickStart.bind(this)}>
                    {<DatePicker
                        id={"startTime"}
                        onChange={this.dateChange}
                        placement={"bottomLeft"}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        value={(this.state.startTime !== "") ? moment( this.state.startTime, "YYYY-MM-DDTHH:mm:ss")! : null}
                        showTime={{ defaultValue: moment('00:00:00', 'HH:mm:ss') }}
                    />}
                </span>
                <span className={style.split}>~</span>
                <span className={`${style.scheDate} ${style.sche_block}`}
                    onClick={this.clickEnd.bind(this)}>
                    {<DatePicker
                        id={"endTime"}
                        onChange={this.dateChange.bind(this)}
                        placement={"bottomLeft"}
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledDate}
                        disabledTime={disabledDateTime}
                        value={(this.state.endTime !== "") ? moment( this.state.endTime, "YYYY-MM-DDTHH:mm:ss")! : null}
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