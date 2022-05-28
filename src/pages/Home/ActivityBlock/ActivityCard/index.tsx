import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import style from './index.module.scss';

import Activity from '../../../../tools/Activity'

interface IProps {
	id: string
	title: string;
	picLink: string;
	isReserve: boolean;
	isOverTime: boolean;
}
export default class index extends Component<IProps> {
	constructor(props: any) {
		super(props);

		this.switchChoose = this.switchChoose.bind(this);
	}

	switchChoose(event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		if (!this.props.isReserve) {
			Activity.reserve(this.props.id);
		} else {
			Activity.cancel(this.props.id);
		}
		event.stopPropagation();
		this.setState({isReserve: !this.props.isReserve});
	}

	cancelBubble(event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		event.stopPropagation();
	}
	
	getPicture() {
		if (this.props.isOverTime) return <></>;

		return <img src={(!this.props.isReserve) ? require('../../../../assets/icon/plus.png') : require('../../../../assets/icon/plus_orange.png')}
					className={(!this.props.isReserve) ? style.imgAdd : style.imgClose}
					onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {this.switchChoose(event)}} />
	}

	render() {
		return (
			<Card className={this.props.isReserve ? `${style.border} ${style.card}` : style.card} 
				  onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => this.switchChoose(event)}>

				<div className={(this.props.isOverTime) ? style.block : style.noneBlock}>
					<div>overTime</div>
				</div>
				<Card.Img variant="top" style={{ height: '250px' }} src={this.props.picLink} />

				<Card.Body>

					<Card.Title style={{ height: '70px' }}>{this.props.title}</Card.Title>

					<div className={style.button}>
						{this.getPicture()}
						<img className={style.bar} style={(this.props.isOverTime) ? {display : 'none'} : {}}
							 src={require('../../../../assets/icon/line.png')} />

						<Link to= {`/activity/` + this.props.id}>
							<img src={(!this.props.isReserve) ? require('../../../../assets/icon/search.png') : require('../../../../assets/icon/search_orange.png')}
								 onClick={() => {this.cancelBubble.bind(this)}} />
						</Link>
					</div>
				</Card.Body>

			</Card>
		);
	}
}
