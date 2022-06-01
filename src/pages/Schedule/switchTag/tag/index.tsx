import React, { Component } from "react";
import style from './index.module.scss';

interface IProps {
    tag: string;
    changePage: Function;
    isChoose: boolean;
}

export default class tag extends Component<IProps> {

    handleClick(){
        this.props.changePage(this.props.tag);
    }

    render(): React.ReactNode {
        return (
            <button className={(this.props.isChoose) ? `${style.tag} ${style.isChoose}` : style.tag} 
                onClick={this.handleClick.bind(this)}
            >
                {this.props.tag}
            </button>
        )
    }
}