import React, { Component } from "react";
import ActivityMap from '../../../components/ActivityMap'
import style from './index.module.scss';


interface IProps {
    style: any,
}
class map extends Component<IProps>{
    

    render(): React.ReactNode {
        return (
            // <div style={this.props.style}>
            <div>
                <ActivityMap />
            </div>
        )
    }

}
export default map