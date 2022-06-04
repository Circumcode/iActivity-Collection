import { CSSProperties, memo } from 'react';

import style from './index.module.scss';


const Divider = memo((props: {isMain: boolean, intHeight: number}) => {
  const css: CSSProperties = {
    height: props.intHeight,
    borderColor: (props.isMain? "#74b7d6" : "pink")
  }
  return (
    <div style={css} className={style.div}></div>
  )
})

export default Divider;