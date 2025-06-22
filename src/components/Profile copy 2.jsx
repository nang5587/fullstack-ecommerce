import TailButton from '../UI/TailButton';

import { useNavigate } from 'react-router-dom';

import ProfileCard from './ProfileCard';

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

                    <div className="mt-4 mb-8 p-4 flex justify-between">
                        <div className='transform scale-300 origin-top-left'>
                            <ProfileCard userData={userData}/>
                        </div>
                        <div className="space-y-4">
                            <InfoRow label="아이디" value={userData.username} />
                            <InfoRow label="생년월일" value={userData.birth} />
                            <InfoRow label="성별" value={userData.gender} />
                            <InfoRow label="전화번호" value={userData.phone} />
                            <InfoRow label="가입일" value={userData.loginat} />
                        </div>
                    </div>

                    {/* --- 프로필 상단 (아바타, 닉네임) --- */}
                    {/* <div className="flex justify-between items-center py-16 border-t border-gray-200">
                        <div className='flex items-center justify-center'>
                            <TailButton
                                onClick={() => navigate('/mypage/verify')}
                            >
                                회원정보 수정
                            </TailButton>
                        </div>
                    </div> */}

                </div>
            </div>
        </div>
    );
};

export default Profile;