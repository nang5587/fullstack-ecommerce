import TailButton from '../UI/TailButton';

import { useNavigate } from 'react-router-dom';

import ProfileCard from './ProfileCard';

import { FiUser, FiHeart } from 'react-icons/fi';
import { RiShoppingBagLine } from 'react-icons/ri';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaRegCommentDots } from "react-icons/fa";
import { FiHelpCircle } from "react-icons/fi";
import { FiEdit } from 'react-icons/fi';


function BackgroundLayers() {
    return (
        <>
            <div
                className="absolute inset-0 w-full h-full 
                            bg-gradient-to-br from-slate-200 via-kalani-mist to-sky-100"
            ></div>

            {/* 왼쪽 상단 야자수 잎 */}
            <img
                src="/wishImgs/leaf.png"
                alt="Palm leaf shadow"
                className="absolute -top-20 -left-40 w-[600px] h-auto 
                            opacity-20 mix-blend-multiply
                            transform rotate-50 pointer-events-none
                            
                            /* ✅ 전환 효과 및 호버 효과 추가 */
                            transition-transform duration-700 ease-out
                            group-hover:rotate-40 group-hover:scale-105"
            />

            {/* 오른쪽 하단 야자수 잎 */}
            <img
                src="/wishImgs/leaf.png"
                alt="Palm leaf shadow"
                className="absolute -bottom-40 -right-40 w-[600px] h-auto 
                            opacity-15 mix-blend-multiply
                            transform -rotate-[120deg] scale-x-[-1] pointer-events-none
                            
                            /* ✅ 전환 효과 및 호버 효과 추가 */
                            transition-transform duration-700 ease-out
                            group-hover:-rotate-[110deg] group-hover:scale-105"
            />

        </>
    );
}

// 상세 정보 항목을 위한 재사용 가능한 컴포넌트
const InfoRow = ({ label, value }) => (
    <div className="flex items-center text-base">
        <span className="w-28 text-gray-500">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
    </div>
);

const Profile = () => {
    const navigate = useNavigate();
    // 실제 애플리케이션에서는 props나 API 호출을 통해 데이터를 받아옵니다.
    const userData = {
        nickname: '강나현',
        username: 'nang5587',
        birth: '2002.11.21',
        gender: '여성',
        phone: '010-1111-1111',
        loginat: '2025-11-21',
        address: '서울특별시 강남구 역삼동 123-45' // 예시 주소
    };

    return (
        <div className="w-11/12 ml-20"> {/* 이 구조는 그대로 유지합니다. */}
            {/* 2. 메인 컨테이너에서 어두운 배경색을 제거합니다. */}
            <div className="relative overflow-hidden min-h-screen group">

                {/* 3. 수정된 BackgroundLayers가 렌더링됩니다. */}
                <BackgroundLayers />

                {/* 콘텐츠 영역은 z-10으로 배경 위에 위치합니다. */}
                <div className="relative z-10 p-8">
                    {/* 4. 밝은 배경에 맞게 제목 텍스트 색상을 어둡게 변경합니다. */}
                    <h2 id="font3" className="text-3xl text-kalani-navy font-bold pb-6 border-b border-gray-400/30">MY INFO</h2>

                    <div className='flex flex-col items-center mt-8'>
                        <div className="mt-4 mb-8 p-4 grid grid-cols-1 2xl:grid-cols-2 gap-6">
                            <ProfileCard userData={userData} />
                            <div id='font3' className="w-[528px] h-[624px] bg-white rounded-[72px] border border-gray-200 p-10 flex flex-col justify-between">
                                <div className="flex-grow flex flex-col justify-between pt-7 px-4"> {/* 정보를 균등하게 분배 */}
                                    {/* 성별 */}
                                    <div className='flex justify-between items-center text-2xl border-b border-gray-100 pb-4 mb-4'>
                                        <p className="text-gray-600">성별</p>
                                        <p className='font-bold text-black'>{userData.gender}</p>
                                    </div>

                                    {/* 전화번호 */}
                                    <div className='flex justify-between items-center text-2xl border-b border-gray-100 pb-4 mb-4'>
                                        <p className="text-gray-600">전화번호</p>
                                        <p className='font-bold text-black'>{userData.phone}</p>
                                    </div>

                                    {/* 가입일 */}
                                    <div className='flex justify-between items-center text-2xl border-b border-gray-100 pb-4 mb-4'>
                                        <p className="text-gray-600">가입일</p>
                                        <p className='font-bold text-black'>{userData.loginat}</p>
                                    </div>

                                    {/* 배송지 */}
                                    <div className='flex justify-between items-center text-2xl'> {/* 마지막 항목은 border-b 제거 */}
                                        <p className="text-gray-600">배송지</p>
                                        <p className='font-bold text-black'>{userData.address}</p>
                                    </div>

                                    <div className='flex justify-between gap-4 mt-10'>
                                        <TailButton
                                            onClick={() => { }}
                                            className="w-full whitespace-nowrap bg-black text-white px-4 py-3 text-3xl rounded-2xl
                                                        hover:bg-kalani-gold transition-colors duration-300
                                                        cursor-pointer relative z-20"
                                        >
                                            <HiOutlineLocationMarker />
                                        </TailButton>
                                        <TailButton
                                            onClick={() => { }}
                                            className="w-full whitespace-nowrap bg-black text-white px-4 py-3 text-3xl rounded-2xl
                                                        hover:bg-kalani-gold transition-colors duration-300
                                                        cursor-pointer relative z-20"
                                        >
                                            <FiEdit />
                                        </TailButton>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;