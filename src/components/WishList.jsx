// src/components/WishList.jsx

// 훅 목록
import wishdata from '../data/wishdata';

// component 목록
import WishCard from './WishCard';
import WavyLayoutFinal from './WavyLayoutFinal';

// ✨ 이 컴포넌트들을 WishList.jsx 파일 안에 함께 정의합니다.
//    또는 별도의 파일로 분리하고 import 해도 됩니다.
function BackgroundLayers() {
    return (
        <>
            {/* 빛 효과 레이어 */}
            <div 
                className="
                    absolute top-0 left-1/2 -translate-x-1/2 
                    w-[200%] h-[1000px] /* ✨ 범위를 더 넓게 */
                    bg-radial-gradient-t
                    blur-3xl /* ✨ 블러 효과 추가로 경계를 완전히 뭉갬 */
                    opacity-80 /* ✨ 투명도 조절 */
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
    return (
        // 1. 가장 바깥쪽 레이아웃은 그대로 유지합니다.
        <div className="w-11/12 ml-20">
            {/* 2. 기존 p-8과 배경색을 가진 div를 relative 컨테이너로 만듭니다. */}
            <div className="relative overflow-hidden bg-kalani-navy to-[#001833] min-h-screen with-palm-leaves">
                
                {/* BackgroundLayers 컴포넌트는 그대로 두거나, 빛 효과 부분만 주석 처리해도 됩니다. */}
                <BackgroundLayers />
                
                {/* 4. 기존 콘텐츠들을 담을 div를 추가하고, z-10으로 위에 오게 합니다. */}
                <div className="relative z-10 p-8">
                    {/* 제목의 색상을 흰색으로 변경하고, border 투명도를 조절합니다. */}
                    <h2 id="font3" className="text-3xl text-white font-bold pb-6 border-b border-gray-200/30">WISH LIST</h2>

                    <div className="mt-8"> {/* 제목과의 간격을 위해 마진 추가 */}
                        <WavyLayoutFinal
                            childWidth={256}
                            childHeight={470}
                            verticalStep={250}
                        >
                            {wishdata.map(item => (
                                <WishCard
                                    key={item.id}
                                    imageUrl={item.image}
                                    name={item.name}
                                    createdat={item.date}
                                />
                            ))}
                        </WavyLayoutFinal>
                    </div>
                </div>
            </div>
        </div>
    );
}