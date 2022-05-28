import { Component, ReactNode } from "react";
import './index.scss';

interface IProps {
    title: string;
    space: string;
    date: string;
    time: string;
    weather: string;
}

export default class sche extends Component<IProps>{

    constructor(props: any){
        super(props);

    }

    render(): ReactNode {
        return(
            <div className="sche">
                <span className="scheTitle sche_block">{this.props.title}</span>
                <span className="line"></span>
                <span className="scheSpace sche_block">{this.props.space}</span>
                <span className="line"></span>
                <span className="scheDate sche_block">{"00/00/00 00:00:00"}</span>
                <span className="split">~</span>
                <span className="scheDate sche_block">{"00/00/00 00:00:00"}</span>
                <span className="line"></span>
                <span className="scheWeather sche_block">{this.props.weather}</span>
                <span className="line"></span>
                <span className="cancel sche_block">x</span>
            </div>
        )
    }
}