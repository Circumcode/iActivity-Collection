import { PureComponent, ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import style from './index.module.scss';
import Activity from '../../tools/Activity';
import { HeaderNoScheduleIcon } from '../../components/Header';
import Footer from '../../components/Footer';

import SwitchTag from './switchTag';
import ScheduleTable from './ScheduleTable';

import ActivityMap from '../../components/ActivityMap';
import pubsub from 'pubsub-js'
import { FUNCTION_CALLER_KEY_UPDATE_MAP, FUNCTION_CALLER_KEY_CALCULATE_ROUTER } from '../../components/ActivityMap';


const intWaitingTime: number = 100;

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

	renderScheduleTable() {
		this.setState({ renderCounterScheduleTable: (this.state.renderCounterScheduleTable + 1) });
	}
	renderScheduleAfterUpdatingActivity(){
		Activity.clearUpdateState();
		let timeoutId = setInterval(() => {
			if (Activity.isUpdated()){
				clearInterval(timeoutId);
				this.renderScheduleTable();
			}
		}, intWaitingTime)
	}
	schedule(){
		Activity.clearTime();
		this.renderScheduleAfterUpdatingActivity();
		pubsub.publish(FUNCTION_CALLER_KEY_CALCULATE_ROUTER);
	}
	resetActivity() {
		Activity.clear();
		pubsub.publish(FUNCTION_CALLER_KEY_UPDATE_MAP);
		this.renderScheduleTable();
	}
	resetTime() {
		Activity.clearTime();
		this.renderScheduleTable();
	}

	componentDidMount() {
		this.setState({ page: '排程' });
		this.renderScheduleAfterUpdatingActivity();
		pubsub.publish(FUNCTION_CALLER_KEY_UPDATE_MAP);
	}

	changePage = (newPage: string) => {
		this.setState({ page: newPage });

		if (newPage === '排程') this.renderScheduleTable();
		if (newPage === '地圖') pubsub.publish(FUNCTION_CALLER_KEY_UPDATE_MAP);
	};

	render(): ReactNode {
		return (
			<>
				<Helmet>
					<style>
						{`
							body {
								overflow: hidden;
							}
						`}
					</style>
				</Helmet>

				<HeaderNoScheduleIcon />

				<div className={style.schedule}>
					<div className={style.changeList}>
						<SwitchTag changePage={this.changePage} choosePage={this.state.page} />
					</div>

					<div style={{ display: (this.state.page === '排程') ? '' : 'none' }}>
						<ScheduleTable renderCounter={this.state.renderCounterScheduleTable} />
					</div>
					<div style={{ display: (this.state.page === '地圖') ? '' : 'none' }}>
						<ActivityMap />
					</div>

					<div id={style.btnList}>
						<button onClick={() => this.resetActivity()}>重設活動</button>
						<button onClick={() => this.resetTime()}>重設時間</button>
						<button onClick={() => this.schedule()}>最快路徑</button>
					</div>
				</div>

				<Footer />
			</>
		);
	}
}

export default SchedulePage;
