import React from 'react';

export default function ProfileCard({ userData }) {
    let avatarSrc;
    if (userData.gender === '여성') {
        avatarSrc = '/avartas/1.png';
    } else {
        avatarSrc = '/avartas/4.png';
    }

    return (
        // ✅ 1. 전체 카드 크기를 3배로 (w-44 -> w-[33rem], h-52 -> h-[39rem])
        <div className="relative w-[33rem] h-[39rem] bg-[#9DC183] rounded-[5rem] border border-white/20 overflow-hidden shadow-xl">

            {/* ✅ 2. 아바타 이미지 크기와 위치도 비율에 맞게 조정 */}
            <img
                className="absolute w-[515px] h-[663px] -bottom-[72px] -right-20 object-contain"
                src={avatarSrc}
                alt="User Avatar"
            />

            {/* ✅ 3. 내부 콘텐츠 영역의 패딩과 요소 배치 조정 */}
            <div className="relative z-10 p-10 flex flex-col justify-between h-full">

                <div>
                    {/* ✅ 폰트 크기와 line-height를 3배로 */}
                    <h3 className="text-black text-[56px] font-bold capitalize leading-tight">
                        {userData.username}
                    </h3>
                </div>

                {/* 하단 콘텐츠 (생년월일) */}
                <p className="text-black text-[42px] font-bold capitalize">
                    {userData.birth}
                </p>
            </div>
        </div>
    );
}