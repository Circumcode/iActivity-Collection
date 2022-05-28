import { Component, ReactNode } from "react";
import style from './index.module.scss';
import DataPicker from '../../../../components/DatePicker';

interface IProps {
    uid: string;
    title: string;
    space: string;
    time: string;
    endTime: string;
    weather: string;
    eventStartTime: string;
    eventEndTime: string;
    cancel: Function;
}

export default class sche extends Component<IProps>{

    cancel(){
        this.props.cancel(this.props.uid);
    }    

    render(): ReactNode {
        return(
            <div className={style.sche}>
                <span className={`${style.scheTitle} ${style.sche_block}`}>{this.props.title}</span>
                <span className={style.line}></span>
                <span className={`${style.scheSpace} ${style.sche_block}`}>{this.props.space}</span>
                <span className={style.line}></span>
                <span className={`${style.scheDate} ${style.sche_block}`}>{<DataPicker />}</span>
                <span className={style.split}>~</span>
                <span className={`${style.scheDate} ${style.sche_block}`}>{<DataPicker />}</span>
                <span className={style.line}></span>
                <span className={`${style.scheWeather} ${style.sche_block}`}>{this.props.weather}</span>
                <span className={style.line}></span>
                <span className={`${style.cancel} ${style.sche_block}`} onClick={this.cancel.bind(this)}>x</span>
            </div>
        )
    }
}