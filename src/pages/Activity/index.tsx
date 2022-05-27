import { request } from 'http';
import { memo } from 'react';

import style from './index.module.scss';
import Footer from '../../components/Footer'


const ActivityPage = memo(() => {
  return (
    <>
      <div
        className={style.div}
      >
        <section id={style.firstSection}>
          <span>{"不只是房子"}</span>
        </section>

        <section id={style.secondSection}>
          <div>
            <img src={require("../../assets/logo.png")} />
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