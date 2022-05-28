import React, { PureComponent } from 'react';
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
	toBlock: Function;
}
export default class index extends PureComponent<IProps> {
	constructor(props: any) {
		super(props);
		
		this.switchChoose = this.switchChoose.bind(this);
	}

	switchChoose(event: React.MouseEvent<HTMLImageElement, MouseEvent>) {
		if (!this.props.isReserve) {
			if(!Activity.isReserved(this.props.id)) 
				Activity.reserve(this.props.id);

			this.props.toBlock();
		} else {
			if(Activity.isReserved(this.props.id)) 
				Activity.cancel(this.props.id);
			this.props.toBlock();
		}
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
				<Card.Img variant="top" style={{height: '250px', userSelect: 'none'}} src={this.props.picLink} />

				<Card.Body>

					<Card.Title className={style.title} style={(!this.props.isReserve) ? {height: '70px'} : {height: '66px'} }>
						{this.props.title}
					</Card.Title>

					<div className={style.button}>
						{this.getPicture()}
						<img className={style.bar} style={(this.props.isOverTime) ? {display : 'none'} : {}}
							 src={require('../../../../assets/icon/line.png')} />

						<Link to= {`/activity/` + this.props.id} onClick={(event) => {event.stopPropagation();}}>
							<img src={(!this.props.isReserve) ? require('../../../../assets/icon/search.png') : require('../../../../assets/icon/search_orange.png')} />
						</Link>
					</div>
				</Card.Body>

			</Card>
		);
	}
}
