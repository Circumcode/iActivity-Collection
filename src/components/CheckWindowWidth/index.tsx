import { memo, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';


export const intMinWindowWidth: number = 1200;

const Loading = memo(() => {
    const isFirstRender = useRef(true);
    const navigate = useNavigate();
    const location = useLocation();
    const [intWindowWidth, setWindowWidth] = useState(window.innerWidth);
    if (isFirstRender.current){
        window.addEventListener("resize", () => {
            setWindowWidth(window.innerWidth);
        })
    }
    
    useEffect(() => {
        if (intWindowWidth < intMinWindowWidth) navigate('/warning');
        else if (location.pathname === '/warning') navigate('/');
    }, [intWindowWidth])

    isFirstRender.current = false;
    return null;
})

export default Loading;