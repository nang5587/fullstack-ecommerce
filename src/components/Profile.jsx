import { useState, useEffect } from 'react';
import api from '../api/axios';  // api 인스턴스 경로 맞게 조정하세요
import TailButton from '../UI/TailButton';
import { FiEdit } from 'react-icons/fi';

import ProfileCard from './ProfileCard';
import EditProfileForm from './EditProfileForm';
import EditAddressForm from './EditAddressForm'; //⭐
import ChangePasswordForm from './ChangePasswordForm';

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
    const [leftFlipped, setLeftFlipped] = useState(false);
    const [rightFlipped, setRightFlipped] = useState(false);
    const [leftCardContent, setLeftCardContent] = useState('');

    const [userData, setUserData] = useState({
        nickname: '',
        username: '',
        birth: '',
        gender: '',
        phone: '',
        email: '',
        createdat: '',
        addresses: [], // 주소 목록을 위한 배열
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchAllData() {
            setLoading(true);
            try {
                const [infoRes, addressRes] = await Promise.all([
                    api.get('/api/member/info'),
                    api.get('/api/member/address')
                ]);
                console.log("infoRes", infoRes);
                console.log("addressRes", addressRes);
                if (typeof infoRes.data !== 'object' || infoRes.data === null || Array.isArray(infoRes.data)) {
                    // 만약 객체가 아니라면, 에러를 발생시켜 catch 블록으로 보냅니다.
                    throw new Error("서버에서 회원 정보를 잘못된 형식으로 보냈습니다.");
                }

                // 데이터 전처리
                let infoData = infoRes.data;
                if (infoData.birth) {
                    infoData.birth = infoData.birth.replace(/\./g, '-');
                }
                // if ('gender' in infoData) {
                //     infoData.gender = infoData.gender === "FEMALE" ? "여성" : "남성";
                // }

                // 두 API의 응답 데이터를 하나의 상태로 합침
                setUserData({ ...infoData, addresses: addressRes.data });
                console.log(userData)

            } catch (err) {
                console.error('데이터 로딩 실패', err);
                const message = err.message || '회원 정보를 불러오는 데 실패했습니다.';
                setError(message);
            } finally {
                setLoading(false);
            }
        }
        fetchAllData();
    }, []);

    const refetchAddresses = async () => {
        try {
            console.log("주소 목록 리프레시 시작..."); // 디버깅용 로그
            const addressRes = await api.get('/api/member/address');
            const addressData = Array.isArray(addressRes.data) ? addressRes.data : [];

            // ✅ 해결책: setUserData를 사용할 때, 반드시 이전 상태(prev)를 기반으로
            //         새로운 주소 목록(addressData)을 합쳐줘야 합니다.
            setUserData(prevUserData => ({
                ...prevUserData, // 기존의 nickname, username 등 모든 정보를 그대로 유지
                addresses: addressData, // addresses 키만 최신 데이터로 덮어쓰기
            }));

            console.log("주소 목록 리프레시 완료!", addressData); // 디버깅용 로그
        } catch (err) {
            console.error("주소 목록 리프레시 실패:", err);
            alert("주소 목록을 새로고침하는 데 실패했습니다.");
        }
    };

    const handleSaveInfo = async (updatedInfo) => {
        try {
            // 주소 관련 필드는 제외하고 전송
            const { addresses, ...infoToSave } = updatedInfo;
            await api.patch('/api/member/infoEdit', infoToSave); // 기본 정보 수정 API
            setUserData(prev => ({ ...prev, ...infoToSave }));
            setRightFlipped(false);
            alert('회원 정보가 수정되었습니다.');
        } catch (err) {
            console.error('회원 정보 저장 실패', err);
            alert('회원 정보 수정에 실패했습니다.');
        }
    };

    // 카드 뒤집기 네비게이션 함수들
    const navigateToAddressEdit = () => {
        setRightFlipped(false);
        setLeftCardContent('address');
        setLeftFlipped(true);
    };

    const navigateToPasswordEdit = () => {
        setRightFlipped(false);
        setLeftCardContent('password');
        setLeftFlipped(true);
    };

    if (loading) {
        return <div className="w-11/12 ml-20 p-10 text-center text-xl text-gray-500">회원 정보를 불러오는 중입니다...</div>;
    }
    if (error) {
        return <div className="w-11/12 ml-20 p-10 text-center text-red-500">{error}</div>;
    }

    // ✅ 주소 목록에서 isDefault가 true인 항목을 찾습니다. 없으면 빈 객체를 사용

    const defaultAddress = (userData.addresses || []).find(addr => addr.main) || {};

    return (
        <div className="w-11/12 ml-20">
            <div className="relative overflow-hidden min-h-screen group">
                <BackgroundLayers />
                <div className="relative z-10 p-8">
                    <h2 id="font3" className="text-3xl text-kalani-navy font-bold pb-6 border-b border-gray-400/30">MY INFO</h2>
                    <div className='flex flex-col items-center mt-8'>
                        <div className="mt-4 mb-8 p-4 grid grid-cols-1 2xl:grid-cols-2 gap-6">

                            {/* 왼쪽 회전 카드 영역 */}
                            <div className="relative w-[528px] h-[624px] [perspective:1500px]">
                                <div className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] relative ${leftFlipped ? '[transform:rotateY(180deg)]' : ''}`}>

                                    {/* 앞면: ProfileCard */}
                                    {/* ✅ 핵심: 뒤집혔을 때는 마우스 이벤트를 무시하도록 pointer-events-none 추가 */}
                                    <div className={`absolute w-full h-full [backface-visibility:hidden] ${leftFlipped ? 'pointer-events-none' : ''}`}>
                                        <ProfileCard userData={userData} />
                                    </div>

                                    {/* 뒷면: 주소 또는 비밀번호 수정 폼 */}
                                    {/* ✅ 핵심: 앞면일 때는 마우스 이벤트를 무시하도록 pointer-events-none 추가 */}
                                    <div className={`absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-white rounded-[72px] border border-gray-200 p-10 ${!leftFlipped ? 'pointer-events-none' : ''}`}>
                                        {leftCardContent === 'address' && (
                                            <EditAddressForm
                                                addresses={userData.addresses || []}
                                                // ✅ onDataChange는 그대로 유지 (핵심 역할)
                                                onDataChange={refetchAddresses}
                                                // ✅ 2. onSave prop 제거
                                                onCancel={() => setLeftFlipped(false)}
                                            />
                                        )}
                                        {leftCardContent === 'password' && (
                                            <ChangePasswordForm
                                                onSave={() => setLeftFlipped(false)}
                                                onCancel={() => setLeftFlipped(false)}
                                            />
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* 오른쪽 회전 카드 영역 */}
                            <div className="relative w-[528px] h-[624px] [perspective:1500px]">
                                <div className={`w-full h-full transition-transform duration-700 [transform-style:preserve-3d] relative ${rightFlipped ? '[transform:rotateY(180deg)]' : ''}`}>
                                    {/* 앞면: 추가 정보 및 수정 버튼 */}
                                    <div className="absolute w-full h-full [backface-visibility:hidden] bg-white rounded-[72px] border border-gray-200 p-10 flex flex-col">

                                        {/* ✅ 2. 정보 목록을 감싸는 div를 만들고, 이 부분만 스크롤되도록 설정합니다. */}
                                        {/* flex-grow: 남는 공간을 모두 차지 */}
                                        {/* overflow-y-auto: 내용이 넘칠 때만 세로 스크롤바 생성 */}
                                        {/* pr-4: 스크롤바가 생겼을 때 내용과 겹치지 않도록 오른쪽 여백 추가 */}
                                        <div className="flex-grow overflow-y-auto pr-4 scrollbar-hide">
                                            <div className="pt-7 px-4 text-xl">
                                                {/* 여기에 모든 정보 목록을 넣습니다. */}
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">이름</p><p className='font-bold'>{userData.nickname}</p></div>
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">성별</p><p className='font-bold'>{userData.gender}</p></div>
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">전화번호</p><p className='font-bold'>{userData.phone}</p></div>
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">이메일</p><p className='font-bold'>{userData.email}</p></div>
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">가입일</p><p className='font-bold'>{userData.createdat.split('T')[0]}</p></div>
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">우편번호</p><p className='font-bold'>{defaultAddress.zip || '없음'}</p></div>
                                                <div className='flex justify-between border-b border-gray-200 pb-4 mb-4'><p className="text-gray-600">배송지</p><p className='font-bold'>{defaultAddress.address1 || '기본 배송지를 설정해주세요.'}</p></div>
                                                <div className='flex justify-between'><p className="text-gray-600"></p><p className='font-bold'>{defaultAddress.address2 || ''}</p></div>
                                            </div>
                                        </div>

                                        {/* ✅ 3. 버튼을 별도의 div로 분리하여 하단에 고정합니다. */}
                                        {/* mt-auto: 자동으로 위쪽 여백을 만들어 맨 아래로 밀어냄 */}
                                        {/* pt-6: 스크롤 영역과의 최소 간격 확보 */}
                                        {/* flex-shrink-0: 공간이 부족해도 버튼이 찌그러지지 않도록 방지 */}
                                        <div className='mt-auto pt-6 flex-shrink-0'>
                                            <TailButton onClick={() => setRightFlipped(true)} className="w-full bg-black  text-white px-2 py-3 text-lg rounded-xl hover:bg-kalani-gold transition-colors">
                                                <FiEdit />&nbsp; 회원정보 수정
                                            </TailButton>
                                        </div>
                                    </div>
                                    <div className="absolute w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden] bg-white rounded-[72px] border border-gray-200 p-10">
                                        <EditProfileForm
                                            initialData={userData}
                                            onSave={handleSaveInfo} // 기본 정보 저장 핸들러 연결
                                            onCancel={() => setRightFlipped(false)}
                                            onNavigateToAddressEdit={navigateToAddressEdit}
                                            onNavigateToPasswordEdit={navigateToPasswordEdit}
                                        />
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