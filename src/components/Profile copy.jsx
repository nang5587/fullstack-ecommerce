import TailButton from '../UI/TailButton';
import { useState } from 'react';
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FiEdit } from 'react-icons/fi';

import ProfileCard from './ProfileCard';
import EditProfileForm from './EditProfileForm';

function BackgroundLayers() {
    return (
        <>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-200 via-kalani-mist to-sky-100"></div>
            <img src="/wishImgs/leaf.png" alt="Palm leaf shadow" className="absolute -top-20 -left-40 w-[600px] h-auto opacity-20 mix-blend-multiply rotate-[50deg] pointer-events-none transition-transform duration-700 ease-out group-hover:rotate-[40deg] group-hover:scale-105" />
            <img src="/wishImgs/leaf.png" alt="Palm leaf shadow" className="absolute -bottom-40 -right-40 w-[600px] h-auto opacity-15 mix-blend-multiply -rotate-[120deg] scale-x-[-1] pointer-events-none transition-transform duration-700 ease-out group-hover:-rotate-[110deg] group-hover:scale-105" />
        </>
    );
}

const Profile = () => {
    const [flipped, setFlipped] = useState(false); // ✅ 카드 회전 상태
    const [userData, setUserData] = useState({
        nickname: '강나현',
        username: 'nang5587',
        birth: '2002-11-21',
        gender: '여성',
        phone: '010-1111-1111',
        email: 'nang5587@na.com',
        createdat: '2025-11-21',
        zip: '123',
        address1: '서울특별시 강남구 역삼동 123-45',
        address2: '203호'
    });

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden min-h-screen group">
                <BackgroundLayers />

                <div className="relative z-10 p-8">
                    <h2 id="font3" className="text-3xl text-kalani-navy font-bold pb-6 border-b border-gray-400/30">MY INFO</h2>

                    <div className='flex flex-col items-center mt-8'>
                        <div className="mt-4 mb-8 p-4 grid grid-cols-1 2xl:grid-cols-2 gap-6">
                            <ProfileCard userData={userData} />

                            {/* 회전 카드 영역 */}
                            <div className="relative w-[528px] h-[624px] [perspective:1500px]">
                                <div className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] relative ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>

                                    {/* 앞면 */}
                                    <div className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-[72px] border border-gray-200 p-10">
                                        <div className="flex-grow flex flex-col justify-between pt-7 px-4 text-xl">
                                            <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">성별</p><p className='font-bold'>{userData.gender}</p></div>
                                            <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">전화번호</p><p className='font-bold'>{userData.phone}</p></div>
                                            <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">가입일</p><p className='font-bold'>{userData.createdat}</p></div>
                                            <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">우편번호</p><p className='font-bold'>{userData.zip}</p></div>
                                            <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">배송지</p><p className='font-bold'>{userData.address1}</p></div>
                                            <div className='flex justify-between'><p className="text-gray-600"></p><p className='font-bold'>{userData.address2}</p></div>

                                            <div className='mt-10'>
                                                <TailButton onClick={() => setFlipped(true)} className="w-full bg-black text-white px-4 py-3 text-3xl rounded-2xl hover:bg-kalani-gold transition-colors">
                                                    <FiEdit />
                                                </TailButton>
                                            </div>
                                        </div>
                                    </div>

                                    {/* 뒷면 */}
                                    <div className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-white rounded-[72px] border border-gray-200 p-10">
                                        <EditProfileForm
                                            initialData={userData}
                                            onSave={(updatedData) => {
                                                setUserData(updatedData);
                                                setFlipped(false);
                                            }}
                                            onCancel={() => setFlipped(false)}
                                        />
                                    </div>
                                </div>
                            </div>
                            {/* 회전 카드 영역 끝 */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
