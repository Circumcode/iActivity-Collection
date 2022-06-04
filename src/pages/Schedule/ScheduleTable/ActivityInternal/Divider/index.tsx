import { CSSProperties, memo } from 'react';

import style from './index.module.scss';


const Divider = memo((props: {intHeight: number}) => {
  const cssHeight: CSSProperties = {
    height: props.intHeight,
  }
  return (
    <div style={cssHeight} className={style.div}></div>
  )
})

export default Divider;