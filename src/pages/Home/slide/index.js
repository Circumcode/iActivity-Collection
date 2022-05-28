import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import style from './index.module.scss';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import Activity from '../../../tools/Activity';

class Frame extends Component {
	arrUrl = this.getImg();

	getImg() {
		let tempArray = [];
		let arrSeason = Activity.getAll();
		for (let index in arrSeason) {
			tempArray.push(arrSeason[index].imageUrl);
		}
		return tempArray;
	}

	render() {
		return (
			<div className="each-slide">
				<div className={style.slideImage} >
					<div className={style.bkImage} style={{backgroundImage: `url(${this.arrUrl[this.props.id]})`}}></div>
					<img src={this.arrUrl[this.props.id]} className={style.img}></img>
				</div>
			</div>
		);
	}
}

const properties = {
	autoplay: true,
	duration: 3000,
	easing: 'ease',
};

const SlideShow = () => {
	return (
		<div>
			<Slide {...properties}>
				<Frame id={0} />
				<Frame id={1} />
				<Frame id={2} />
				<Frame id={3} />
				<Frame id={4} />
			</Slide>
		</div>
	);
};
export default SlideShow;

const root = document.getElementById('root');
ReactDOM.render(SlideShow(), root);
