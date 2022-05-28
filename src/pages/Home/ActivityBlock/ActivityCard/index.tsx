import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import style from './index.module.scss';

interface IProps {
	id: string
	title: string;
	picLink: string;
	isOverTime: boolean;
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
		this.switchChoose = this.switchChoose.bind(this);
	}

	choose() {
		if (!this.props.isOverTime)
			this.setState({isChoose: true});
	}
	switchChoose(event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		event.stopPropagation();
		this.setState({isChoose: !this.state.isChoose});
	}
	
	getPicture() {
		if (this.props.isOverTime) return <></>;

		return <img src={(!this.state.isChoose) ? require('../../../../assets/icon/plus.png') : require('../../../../assets/icon/plus_orange.png')}
					className={(!this.state.isChoose) ? style.imgAdd : style.imgClose}
					onClick={(event: React.MouseEvent<HTMLImageElement, MouseEvent>) => {this.switchChoose(event)}} />
	}

	render() {
		return (
			<Card className={this.state.isChoose ? style.border : ''} style={{ width: '25em', boxShadow: '2px 2px 2px 1px rgba(0, 0, 0, 0.2)'}}
				  onClick={this.choose}>

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

						<Link to= {`../../../Activity/` + this.props.id}>
							<img src={(!this.state.isChoose) ? require('../../../../assets/icon/search.png') : require('../../../../assets/icon/search_orange.png')}
								 onClick={(event) => {event.stopPropagation();}} />
						</Link>
					</div>
				</Card.Body>

			</Card>
		);
	}
}
