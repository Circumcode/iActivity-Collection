import React, { Component } from 'react';

import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './index.module.scss';

interface IProps {
	title: string;
	picLink: string;
}
interface IState {
	isChoose: boolean;
}
export default class index extends Component<IProps, IState> {
	constructor(props: any) {
		super(props);

		this.state = {
			isChoose: false,
		};

		this.choose = this.choose.bind(this);
	}

	choose() {
		this.setState({isChoose: true});
	}
	
	getPicture() {
		if (this.state.isChoose)
			return <img src={require('../../../../assets/icon/close.png')} style={{ width: '50px' }}
						onClick={() => {this.setState({isChoose: false})}} />
		else 
			return <img src={require('../../../../assets/icon/plus.png')} style={{ width: '50px' }}
						onClick={this.choose} />
	}

	render() {
		return (
			<Card className={this.state.isChoose ? style.border : ''} style={{ width: '20em' }} onClick={this.choose}>
				<Card.Img variant="top" style={{ height: '250px' }} src={this.props.picLink} />
				<Card.Body>
					<Card.Title style={{ height: '50px' }}>{this.props.title}</Card.Title>
					<div className={style.button}>
						{this.getPicture()}
						<img className={style.bar} src={require('../../../../assets/icon/line.png')} />
						<img src={require('../../../../assets/icon/search.png')} style={{ width: '25px' }} 
							 onClick={(event) => {event.preventDefault(); console.log('serach~~~')}} />
					</div>
				</Card.Body>
			</Card>
		);
	}
}
