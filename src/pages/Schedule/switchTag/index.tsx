import { Component, ReactNode } from "react";
import Tag from './tag';
import style from './index.module.scss';

const tag = ["排程", "地圖"]

interface IProps {
    changePage: Function;
}

class switchTag extends Component<IProps> {

    getTag(){
        let tagNodes = [];
        for (let i=0; i<tag.length; i++){
            tagNodes.push(<Tag tag={tag[i]} key={i} changePage={this.props.changePage}/>);
        }
        return tagNodes
    }
    render(): ReactNode {
        return(
            <div className={style.tagContainer}>{this.getTag()}</div>
        )
    }
}
export default switchTag