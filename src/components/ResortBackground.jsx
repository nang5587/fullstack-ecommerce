// src/components/ResortBackground.js (이전과 동일)

import React from 'react';
import sunImage from '/wishImgs/sun.png';
export default function ResortBackground() {
    return (
        <div className="fixed top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-orange-100 to-rose-100"></div>
            <img
                src={sunImage}
                alt="Rotating sun"
                className="absolute top-20 right-20 w-48 h-48 opacity-70 animate-spin-slow z-99"
            />
            {/* <div className="absolute bottom-0 left-0 w-full">
                <img
                    src="/wave1.svg"
                    alt="Flowing wave"
                    className="absolute bottom-0 left-0 w-[200%] h-auto opacity-40 animate-wave-flow"
                />
                <img
                    src="/wave2.svg"
                    alt="Flowing wave"
                    className="absolute bottom-0 left-0 w-[200%] h-auto opacity-20 animate-wave-flow-reverse"
                />
            </div>
            <img
                src="/palm-leaf.png"
                alt="Palm leaf silhouette"
                className="absolute bottom-[-50px] right-[-50px] w-96 h-auto opacity-60 transform -rotate-45"
            /> */}
        </div>
    );
}