import React, { PureComponent } from 'react';

import { Button, Card } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface IProps {
    title: string,
    picLink: string,
}
export default class index extends PureComponent<IProps> {
    constructor(props: any) {
        super(props);
    }
    // src={require(this.props.picLink)} 
	render() {
		return (
			<Card style={{ width: '18rem' }}>
				<Card.Img variant="top" src={this.props.picLink} />
				<Card.Body>
					<Card.Title>{this.props.title}</Card.Title>
					<Button variant="primary">details...</Button>
				</Card.Body>
			</Card>
		);
	}
}
