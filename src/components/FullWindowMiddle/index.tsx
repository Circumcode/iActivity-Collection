import React, { CSSProperties, memo, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';


const intHeaderHeight: number = 0; // header's position: fixed;
const intFooterHeight: number = 60;
const intOtherComponentHeight: number = intHeaderHeight + intFooterHeight + 2;

const FullWindowUnit = memo((props: {children: React.ReactNode, css: CSSProperties, isMinHeight: boolean}) => {
  const isFirstRender = useRef(true);
  const refContainer = useRef<HTMLDivElement>(null);
  const updatePageHeight: Function = () => {
    let intContainerHeight: number = window.innerHeight - intOtherComponentHeight;
    let intChildrenHeight: number = refContainer.current?.clientHeight ?? 0;
    setPageHeight(intContainerHeight);
    if (intContainerHeight >= intChildrenHeight) setUnderRangeState(true);
    else setUnderRangeState(false);
  }
  const [isUnderRange, setUnderRangeState] = useState(false);
  const [intPageHeight, setPageHeight] = useState<number | string>("unset");
  if (isFirstRender.current){
    window.addEventListener( "resize", () => updatePageHeight() )
  }
  const { pathname } = useLocation();
  useEffect(() => {
    updatePageHeight();
  }, [pathname])


  isFirstRender.current = false;
  const cssHeight: CSSProperties = {
    height: (!props.isMinHeight && isUnderRange)? intPageHeight : "unset",
    minHeight: (props.isMinHeight)? intPageHeight : "unset",
  }
  return (
    <div
      ref={refContainer}
      style={{...cssHeight, ...props.css}}
      onLoad={() => updatePageHeight()}
    >
      {props.children}
    </div>
  )
})


const FullWindowMiddle = memo((props: {children: React.ReactNode}) => {
  const css: CSSProperties = {
    width: "100%",
    display: "flex",
    alignItems: "center",
  }
  return (
    <FullWindowUnit css={css} isMinHeight={false}>
      {props.children}
    </FullWindowUnit>
  )
})

export default FullWindowMiddle;


export const AtLeastFullWindow = memo((props: {children: React.ReactNode}) => {
  return (
    <FullWindowUnit css={{}} isMinHeight={true}>
      {props.children}
    </FullWindowUnit>
  )
})