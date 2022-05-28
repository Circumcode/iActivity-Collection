import { Component, ReactNode } from 'react';

import './index.scss';
import Header from '../../components/Header';
import SwitchTag from './switchTag';
import ScheBlock from './scheBlock';
import ScheMap from './ScheMap';
import Footer from '../../components/Footer';

interface IProps {};
interface IState {
  page: string,
}

class SchedulePage extends Component<IProps, IState> {
  constructor(props: any){
    super(props);
    this.state = {
      page: "排程"
    }
    this.changePage = this.changePage.bind(this);
  }

  changePage = (newPage: string) => {
    this.setState({
      page: newPage,
    });
    if(this.state.page === "地圖"){

    }
  }

  render(): ReactNode {
    return (
      <>
        <Header/>
        <div className='schedule'>
          <SwitchTag changePage={this.changePage}/>
          <ScheBlock style={{display: this.state.page === "排程" ? "block" : "none"}} />
          <ScheMap style={{display: this.state.page === "地圖" ? "block" : "none"}} />
        </div>
        <Footer/>
      </>
    )
  }
}

export default SchedulePage;
