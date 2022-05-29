import React, { Component } from "react";
import ActivityMap from '../../../components/ActivityMap'


interface IProps {
    display: boolean,
}
class map extends Component<IProps>{
    render(): React.ReactNode {
        return (
            <div style={{display: (this.props.display) ? '' : 'none'}}>
                <ActivityMap />
            </div>
        )
    }

}
export default map