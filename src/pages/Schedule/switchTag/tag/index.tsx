import React, { Component } from "react";
import style from './index.module.scss';

interface IProps {
    tag: string;
    changePage: Function;
}

export default class tag extends Component<IProps> {

    handleClick(){
        this.props.changePage(this.props.tag);
    }

    render(): React.ReactNode {
        return (
            <button className={style.tag} onClick={this.handleClick.bind(this)}>{this.props.tag}</button>
        )
    }
}