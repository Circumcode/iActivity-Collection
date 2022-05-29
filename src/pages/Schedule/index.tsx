import { PureComponent, ReactNode } from 'react';

import style from './index.module.scss';
import Header from '../../components/Header';
import SwitchTag from './switchTag';
import ScheBlock from './scheBlock';
import ActivityMap from '../../components/ActivityMap';
import Footer from '../../components/Footer';

import pubsub from 'pubsub-js'
// import FunctionCaller from '../../tools/FunctionCaller';
import { FUNCTION_CALLER_KEY_UPDATE_MAP } from '../../components/ActivityMap';

interface IProps {}
interface IState {
	page: string;
}

class SchedulePage extends PureComponent<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			page: '地圖',
		};

		this.changePage = this.changePage.bind(this);
	}

	componentDidMount(){
		this.setState({page: '排程'});
	}

	changePage = (newPage: string) => {
		this.setState({ page: newPage });
		if (this.state.page === '地圖') pubsub.publish(FUNCTION_CALLER_KEY_UPDATE_MAP)
	};

	render(): ReactNode {
		return (
			<>
				<Header />

				<div className={style.schedule}>
					<div className={style.changeList}>
						<SwitchTag changePage={this.changePage} choosePage={this.state.page} />
					</div>

					<ScheBlock style={{ display: this.state.page === '排程' ? 'block' : 'none' }} />
					<div style={{display: (this.state.page === '地圖') ? '' : 'none'}}>
						<ActivityMap />
					</div>
				</div>

				<Footer />
			</>
		);
	}
}

export default SchedulePage;
