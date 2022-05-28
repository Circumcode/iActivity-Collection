import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import style from './index.module.scss';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'

const url = 'https://raw.githubusercontent.com/Circumcode/iActivity-Collection/APIData/ActivityData.json';
const arrUrl = [];
const axios = require('axios').default;

axios.get(url).then((response)=>{
  let data = response.data;
  let index = 0;
  for (let i=1; i<data.length; i++){
    if (data[i].imageUrl != ""){
      arrUrl[index] = data[i].imageUrl;
      index++;
    }
  }
}).catch(function (error) {
  console.log(error);
})



class Frame extends Component {
  render() {
    return (
      <div className='each-slide'>

        <div className={style.slideImage}>
          <img src={arrUrl[this.props.id]} className={style.img}></img>
        </div>

      </div>
    )
  }
}

const properties = {
  autoplay: true,
  duration: 3000,
  easing: "ease"
}

const SlideShow = ()=> {
  return (
    <div>
      <Slide {...properties}>
        <Frame id={0} />
        <Frame id={1}/>
        <Frame id={2}/>
        <Frame id={3}/>
        <Frame id={4}/>
      </Slide>
    </div>
  )
}
export default SlideShow;

const root = document.getElementById('root');
ReactDOM.render(SlideShow(), root);


