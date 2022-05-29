import { PureComponent, ReactNode } from 'react';

import style from './index.module.scss';
import Header from '../../components/Header';
import SwitchTag from './switchTag';
import ScheBlock from './scheBlock';
import ScheMap from './ScheMap';
import Footer from '../../components/Footer';

import FunctionCaller from '../../tools/FunctionCaller';
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

	changePage = (newPage: string) => {
		this.setState({ page: newPage });

		if (this.state.page === '地圖' && FunctionCaller.hasKey(FUNCTION_CALLER_KEY_UPDATE_MAP)) {
			FunctionCaller.call(FUNCTION_CALLER_KEY_UPDATE_MAP);
		}
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
					<ScheMap display={this.state.page === '地圖'} />
				</div>

				<Footer />
			</>
		);
	}
}

export default SchedulePage;
