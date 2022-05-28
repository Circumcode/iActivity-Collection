import { memo, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'

import Activity from '../../tools/Activity';


const Loading = memo((props: {setLoadedState: Function}) => {
    Activity.load();

    const intDelayTime: number = 100;
    const navigate = useNavigate();
    const location = useLocation();
    const strTargetPathname = useRef(location.pathname);
    if (strTargetPathname.current == "/loading") strTargetPathname.current = "/";

    useEffect(() => {
        navigate('/loading');
        if (!Activity.isLoad()) {
            let timeoutId = setInterval(() => {
                if (Activity.isLoad()) {
                    clearInterval(timeoutId);
                    navigate(strTargetPathname.current);
                }
            }, intDelayTime);
        }
        else {
            setTimeout(() => {
                navigate(strTargetPathname.current);
            }, intDelayTime)
            props.setLoadedState(true);
        }
    })

    return null;
})

export default Loading;