// ⭐ 더미
// import wishdata from '../data/wishdata';

// 훅 목록
import { useState, useEffect } from 'react';

// component 목록
import WishCard from './WishCard';
import WavyLayoutFinal from './WavyLayoutFinal';

import api from "../api/axios";

function BackgroundLayers() {
    return (
        <>
            {/* 빛 효과 레이어 */}
            <div
                className="
                    absolute top-0 left-1/2 -translate-x-1/2 
                    w-[200%] h-[1000px]
                    bg-radial-gradient-t
                    blur-3xl
                    opacity-80
                "
            />

            {/* 물결 SVG 레이어들 */}
            <Wave className="absolute bottom-0 left-0 w-[200%] h-auto text-kalani-gold/10 animate-wave-slow" />
            <Wave className="absolute bottom-0 left-0 w-[200%] h-auto text-kalani-gold/20 animate-wave-medium" style={{ bottom: '-5px' }} />
            <Wave className="absolute bottom-0 left-0 w-[200%] h-auto text-kalani-gold/30 animate-wave-fast" style={{ bottom: '-10px' }} />
        </>
    );
}

function Wave({ className, ...props }) {
    const wavePath = "M0,160L48,181.3C96,203,192,245,288,240C384,235,480,181,576,149.3C672,117,768,107,864,128C960,149,1056,203,1152,213.3C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z";
    return (
        <div className={className} {...props}>
            <svg className="w-1/2 h-auto inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="1" d={wavePath}></path></svg>
            <svg className="w-1/2 h-auto inline-block" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="currentColor" fillOpacity="1" d={wavePath}></path></svg>
        </div>
    );
}


export default function WishList() {

    const [wishes, setWishes] = useState([]);

    // 위시 목록
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const response = await api.get('/api/member/wish');
                console.log("백앤드로부터 받은 위시목록: ", response.data);
                setWishes(response.data); // 위시리스트 배열
            } catch (error) {
                console.error('위시리스트 불러오기 실패:', error);
            }
        };

        fetchWishlist();
    }, []);

    // 삭제 
    const handleRemoveWish = async (imgname) => {
        console.log('백앤드로 보낼 삭제예정 위시 : ', imgname)
        try {
            await api.delete('/api/member/deletewish', {
                params: {
                    imgname: imgname
                }
            });
            setWishes(prev => prev.filter(item => item.imgname !== imgname));
        } catch (error) {
            console.error('위시 삭제 실패:', error);
        }
    };

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden bg-kalani-navy to-[#001833] min-h-screen with-palm-leaves">
                <BackgroundLayers />

                {/* 4. 기존 콘텐츠들을 담을 div를 추가하고, z-10으로 위에 오게 합니다. */}
                <div className="relative z-10 p-8">
                    <h2 id="font3" className="text-3xl text-white font-bold pb-6 border-b border-gray-200/30">WISH LIST</h2>

                    <div className="mt-8">
                        <WavyLayoutFinal
                            childWidth={256}
                            childHeight={470}
                            verticalStep={250}
                        >
                            {wishes.map(item => ( // ⭐ wishdata => wishes
                                <WishCard
                                    key={item.imgname}
                                    imgname={item.imgname} // ✅ imagname -> imgname (백엔드 키에 맞춤)
                                    imageUrl={item.imageUrl} // ✅ 백엔드 키에 맞춤
                                    productName={item.productName}
                                    createdat={item.createdat} // ✅ 백엔드 키에 맞춤
                                    // ✅ 4. onRemoveClick으로 prop 이름 변경 및 올바른 값 전달
                                    onRemoveClick={() => handleRemoveWish(item.imgname)}
                                />
                            ))}
                        </WavyLayoutFinal>
                    </div>
                </div>
            </div>
        </div>
    );
}