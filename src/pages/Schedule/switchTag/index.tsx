import { Component, ReactNode } from 'react';
import Tag from './tag';
import style from './index.module.scss';

const tag = ['排程', '地圖'];

interface IProps {
	changePage: Function;
    choosePage: string;
}
class switchTag extends Component<IProps> {
	getTag() {
		let tagNodes = [];
		for (let i = 0; i < tag.length; i++) {
			tagNodes.push(
                <Tag  key={tag[i]} tag={tag[i]} changePage={this.props.changePage} isChoose={tag[i]===this.props.choosePage}/>
            );
		}

		return tagNodes;
	}
	render(): ReactNode {
		return <div className={style.tagContainer}>{this.getTag()}</div>;
	}
}
export default switchTag;
