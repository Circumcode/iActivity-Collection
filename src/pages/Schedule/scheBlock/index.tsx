import { Component, ReactNode } from "react";
import './index.scss';
import Sche from './sche';


class scheDetail {
    title: string;
    space: string;
    date: string;
    time: string;
    weather: string;

    constructor(title: string, space: string, date: string, time: string, weather: string){
        this.title = title;
        this.space = space;
        this.date = date;
        this.time = time;
        this.weather = weather;
    }
}

const data: scheDetail = {
    title: "123",
    space: "here",
    date: "1/1/1",
    time: "1:1:1",
    weather: "123456",
}

interface IProps {
    style: any,
};
interface IState {
    // scheDetials: Array<scheDetail>,
    visible: boolean,
}

export default class ScheBlock extends Component<IProps, IState> {
    constructor(props: any){
        super(props);
        this.state = {
            // scheDetails: ["", "", "", "", ""],
            visible: true,
        }
    }

    getSche(){
        
    }

    render(): ReactNode {
        return (
            <div className="scheblock" style={this.props.style}>
                <Sche {...data}></Sche>
                <Sche {...data}></Sche>
                <Sche {...data}></Sche>
                <button className="cleantimeButton">clean All</button>
            </div>
        )
    }
}



