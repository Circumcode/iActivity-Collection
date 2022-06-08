import { memo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import Activity from '../../tools/Activity';


const Loading = memo((props: {setLoadedState: Function}) => {
    const isFirstRender = useRef(true);
    const intDelayTime: number = 100;
    const navigate = useNavigate();
    const location = useLocation();
    const strTargetPathname = useRef(location.pathname);
    if (strTargetPathname.current == "/loading") strTargetPathname.current = "/";

    const executeAfterLoaded: Function = () => {
        setTimeout(() => {
            navigate(strTargetPathname.current);
        }, intDelayTime)
        props.setLoadedState(true);
    }

    
    if (isFirstRender.current){
        // Activity.load();
        const timeoutId = setInterval(() => {
            if (Activity.isLoaded()) {
                clearInterval(timeoutId);
                executeAfterLoaded();
            }
            if (Activity.isFailed()) clearInterval(timeoutId);
        }, intDelayTime);
    }
    
    useEffect(() => {
        if ((!Activity.isLoaded()) && (location.pathname.split("/")[2] != '/loading')){
            navigate('/loading');
        }
    }, [isFirstRender])

    isFirstRender.current = false;
    return null;
})

export default Loading;