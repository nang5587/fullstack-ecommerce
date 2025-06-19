import { useEffect, useState } from 'react';
import TailButton from '../UI/TailButton';

export default function AddressInput({ onComplete }) {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const openPostcode = () => {
        new window.daum.Postcode({
            oncomplete: (data) => {
                const { zonecode, roadAddress } = data;
                onComplete({ zip: zonecode, address1: roadAddress });
            },
        }).open();
    };

    return (
        <TailButton variant="selGhost" size="sm" type="button" onClick={openPostcode} className="w-full h-full whitespace-nowrap">
            검색
        </TailButton>
    );
}
