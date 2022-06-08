import { CSSProperties, memo, useState } from 'react';

import style from './index.module.scss';
import classActivity from '../../tools/Activity';
import { Link } from 'react-router-dom';
import FullWindowMiddle from '../FullWindowMiddle';


const Activity = memo((props: {activity: any}) => {
  const [isReserve, setReservedState] = useState(classActivity.isReserved(props.activity.UID));
  const changeReservedState: React.MouseEventHandler<HTMLElement> = () => {
    if (!isReserve) {
      alert("已將此活動加入排成清單");
      classActivity.reserve(props.activity.UID);
    }
    else classActivity.cancel(props.activity.UID);
    setReservedState(!isReserve);
  }


  const cssInfo: CSSProperties = {
    backgroundColor: isReserve? "#faf8e7" : "#eaf3f5",
  }
  const cssPlusAndFork: CSSProperties = {
    transform: isReserve? "rotate(135deg)" : "unset",
  }
  return (
    <div
      className={style.div}
    >
      <section id={style.firstSection}>
        <Link
          to='/'
        >
          <img className={style.icon} src={require("../../assets/icon/angleBrackets.png")} />
        </Link>
        <span>{props.activity.title}</span>
      </section>

      <section id={style.secondSection}>
        <div>
          <img id={style.image} src={classActivity.getImageUrl(props.activity.UID)} />
          <section
            id={style.info}
            style={cssInfo}
            onClick={changeReservedState}
          >
            <img
              className={style.icon}
              style={cssPlusAndFork}
              src={require("../../assets/icon/plus.png")}
            />
            <p>活動日期：{props.activity.startDate + " ~ " + props.activity.endDate}</p>
            <p>活動地點：{props.activity.showInfo[0].location}</p>
            <p>{(props.activity.showInfo[0].isIndoor == "Y")? "室內" : "室外"}</p>
          </section>
          <section>{props.activity.descriptionFilterHtml}</section>
          <hr />
          <div id={style.container}>
            <a
              target="_blank"
              href={props.activity.sourceWebPromote}
            >
              <img
                src={require("../../assets/icon/open.png")}
              />
              <span>前往官方網站</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
})

export default Activity;


export const NotExistActivity = memo(() => {
  return (
    <FullWindowMiddle>
      <p className={style.p}>Sorry... 找不到這個活動 &gt;&lt;</p>
    </FullWindowMiddle>
  )
})