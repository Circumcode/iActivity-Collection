import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import style from './index.module.scss';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

import Activity from '../../../tools/Activity';

class Frame extends Component {
	render() {
		return (
			<div className="each-slide">
				<div className={style.slideImage} >
					<div className={style.bkImage} style={{backgroundImage: `url(${this.props.arrUrl[this.props.id]})`}}></div>
					
					<Link to={'/Activity/' + this.props.arrUID[this.props.id]}>
						<img src={this.props.arrUrl[this.props.id]} className={style.img}></img>
					</Link>
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

let getDetail = (detail) => {
	let tempArray = [];
	let arrSeason = Activity.getAll();
	for (let index in arrSeason) {
		tempArray.push(arrSeason[index][detail]);
	};
	return tempArray;
}

const SlideShow = () => {
	const arrUrl = getDetail('imageUrl');
	const arrUID = getDetail('UID');


	const createFrame = () => {
		let tempArray = [];
		for (let index = 0; index < arrUrl.length; index++) {
			tempArray.push(<Frame id={index} key={index} arrUrl={arrUrl} arrUID={arrUID}/>);
		}
		return tempArray;
	}

	return (
		<div>
			<Slide {...properties}>
				{createFrame()}
			</Slide>
		</div>
	);
};
export default SlideShow;

