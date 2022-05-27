import { request } from 'http';
import { memo } from 'react';

import style from './index.module.scss';
import Header from '../../components/Header'
import Footer from '../../components/Footer'


const ActivityPage = memo(() => {
  return (
    <>
      <Header />
      
      <div
        className={style.div}
      >
        <section id={style.firstSection}>
          <span>{"不只是房子"}</span>
        </section>

        <section id={style.secondSection}>
          <div>
            <img src={require("../../assets/logo512.png")} />
            <section>
              <img
                className={style.icon}
                src={require("../../assets/icon/plus.png")}
              />
            </section>
            <section>{"我是內文"}</section>
            <hr />
            <button>前往官方網站</button>
          </div>
        </section>
      </div>

      <Footer />
    </>
  )
})

export default ActivityPage;