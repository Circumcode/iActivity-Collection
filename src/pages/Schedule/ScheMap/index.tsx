import React, { Component } from "react";

interface IProps {
    style: any,
}
class map extends Component<IProps>{
    
    render(): React.ReactNode {
        return(
            <div style={this.props.style}>map</div>
        )
    }
    
}
export default map