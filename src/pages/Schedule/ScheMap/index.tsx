import React, { Component } from "react";
import ActivityMap from '../../../components/ActivityMap'


interface IProps {
    style: any,
}
class map extends Component<IProps>{

    render(): React.ReactNode {
        return (
            <div>
                <ActivityMap />
            </div>
        )
    }

}
export default map