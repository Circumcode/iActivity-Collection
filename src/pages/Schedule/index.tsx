import { PureComponent, ReactNode } from 'react';

import style from './index.module.scss';
import { HeaderEmpty } from '../../components/Header';
import Footer from '../../components/Footer';
import Activity from '../../tools/Activity';

import SwitchTag from './switchTag';
import ScheduleTable from './ScheduleTable';
// import ScheBlock from './scheBlock';

import ActivityMap from '../../components/ActivityMap';
import pubsub from 'pubsub-js'
// import FunctionCaller from '../../tools/FunctionCaller';
import { FUNCTION_CALLER_KEY_UPDATE_MAP, FUNCTION_CALLER_KEY_CALCULATE_ROUTER } from '../../components/ActivityMap';

interface IProps {}
interface IState {
	page: string;
	renderCounterScheduleTable: number;
}

class SchedulePage extends PureComponent<IProps, IState> {
	constructor(props: any) {
		super(props);
		this.state = {
			page: '地圖',
			renderCounterScheduleTable: 0
		};

		this.changePage = this.changePage.bind(this);
	}

	renderScheduleTable(){
		this.setState({renderCounterScheduleTable: (this.state.renderCounterScheduleTable + 1)});
	}
	resetActivity(){
		Activity.clear();
		this.renderScheduleTable();
	}
	resetTime(){
		Activity.clearTime();
		this.renderScheduleTable();
	}

	componentDidMount(){
		this.setState({page: '排程'});
	}

	changePage = (newPage: string) => {
		this.setState({ page: newPage });
		if (newPage === '地圖') pubsub.publish(FUNCTION_CALLER_KEY_UPDATE_MAP)
	};

	render(): ReactNode {
		return (
			<>
				<HeaderEmpty />

				<div className={style.schedule}>
					<div className={style.changeList}>
						<SwitchTag changePage={this.changePage} choosePage={this.state.page} />
					</div>

					<div style={{display: (this.state.page === '排程') ? '' : 'none'}}>
						<ScheduleTable renderCounter={this.state.renderCounterScheduleTable} />
					</div>
					{/* <ScheBlock style={{ display: this.state.page === '排程' ? 'block' : 'none' }} /> */}
					<div style={{display: (this.state.page === '地圖') ? '' : 'none'}}>
						<ActivityMap />
					</div>

					<div id={style.btnList}>
						<button onClick={() => pubsub.publish(FUNCTION_CALLER_KEY_CALCULATE_ROUTER)}>最快路徑</button>
						<button onClick={() => this.resetTime()}>重設時間</button>
						<button onClick={() => this.resetActivity()}>重設活動</button>
					</div>
				</div>

				<Footer />
			</>
		);
	}
}

export default SchedulePage;
