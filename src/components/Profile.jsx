import TailButton from '../UI/TailButton';

import { useNavigate } from 'react-router-dom';


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
        username: 'USERNAME',
        birth: '2002.11.21',
        gender: '여성',
        phone: '010-1111-1111',
        loginat: '2025-11-21',
    };

    return (
        <div className="w-10/12 ml-20">
            <h1 id='font4' className='text-kalani-navy font-bold text-2xl pb-10'>회원정보</h1>

            {/* --- 프로필 상단 (아바타, 닉네임) --- */}
            <div className="flex justify-between items-center py-16 border-t border-gray-200">
                <div className='flex items-center'>
                    <div className="w-10 h-10 rounded-full bg-kalani-creme flex items-center justify-center mr-5">
                        <span className="text-sm font-bold text-gray-600">
                            {userData.username.split(' ').map(n => n[0]).join('').toUpperCase()}
                        </span>
                    </div>
                    <h2 className="text-lg font-bold text-gray-800">{userData.nickname}</h2>
                </div>
                <div className='flex items-center justify-center'>
                    <TailButton
                        onClick={() => navigate('/mypage/verify')}
                    >
                        회원정보 수정
                    </TailButton>
                </div>
            </div>

            {/* --- 상세 정보 리스트 --- */}
            <div className="space-y-4">
                <InfoRow label="아이디" value={userData.username} />
                <InfoRow label="생년월일" value={userData.birth} />
                <InfoRow label="성별" value={userData.gender} />
                <InfoRow label="전화번호" value={userData.phone} />
                <InfoRow label="가입일" value={userData.loginat} />
            </div>
        </div>
    );
};

export default Profile;