import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import MyPageLayout from "./MyPageLayout";

import OrderList from "./OrderList";
import WishList from "./WishList";
import Profile from "./Profile";

export default function MyPage() {
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null); // 사용자 데이터를 저장할 상태
    const [isLoading, setIsLoading] = useState(true); // 로딩 중인지 여부를 관리할 상태
    const [error, setError] = useState(null); // 에러 상태 관리
    const { '*': tab } = useParams();
    const selectedTab = tab || 'orderlist';

    // 2. useEffect를 사용하여 컴포넌트 마운트 시 데이터 fetching
    useEffect(() => {
        // 로컬 스토리지에서 토큰 가져오기
        const token = localStorage.getItem('accessToken');

        // 토큰이 없는 경우 (비로그인)
        if (!token) {
            alert('로그인이 필요합니다.');
            navigate('/login?redirect=/mypage');
            return; // useEffect 실행 중단
        }

        const fetchMyData = async () => {
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                // ⭐ 나중에 주석 풀기
                // const response = await fetch(`http://${baseUrl}/api/member`, {
                //     method: 'GET',
                //     headers: {
                //         'Authorization': `Bearer ${token}`
                //     }
                // });
                // if (response.ok) {
                //     const myData = await response.json();
                //     setUserData(myData); // 3. 성공 시 받아온 데이터를 상태에 저장
                //     console.log('내 정보:', myData);
                // } else {
                //     // 401(Unauthorized) 등 인증 실패 시
                //     console.error('인증 실패:', response.status);
                //     alert('세션이 만료되었습니다. 다시 로그인해주세요.');
                //     localStorage.removeItem('accessToken'); // 만료된 토큰 삭제
                //     navigate('/login'); // 로그인 페이지로 리디렉션
                // }
            } catch (err) {
                console.error('요청 중 오류:', err);
                setError('데이터를 불러오는 중 문제가 발생했습니다.'); // 에러 상태 업데이트
            } finally {
                setIsLoading(false); // 4. 로딩 완료 (성공/실패 무관)
            }
        };

        fetchMyData(); // 비동기 함수 호출

    }, [navigate]); // navigate가 변경될 때만 재실행 (사실상 한 번만 실행됨)


    // 5. 로딩 및 에러 상태에 따른 조건부 렌더링
    if (isLoading) {
        return <div>로딩 중...</div>; // 사용자에게 로딩 중임을 알려줌
    }

    if (error) {
        return <div>에러: {error}</div>; // 에러 메시지 표시
    }


    const tabContent = () => {
        switch (selectedTab) {
            case 'orderlist': return <OrderList />;
            case 'wishlist': return <WishList />;
            case 'profile': return <Profile />;
            case 'address': return;
            case 'myreview': return;
            case 'myqna': return;
            default: return null;
        }
    };

    const handleChangeTab = (newTabId) => {
        navigate(`/mypage/${newTabId}`); // ← 탭 클릭 시 URL 이동
    };

    return (
        <MyPageLayout selectedTab={selectedTab} onChangeTab={handleChangeTab}>
            {tabContent()}
        </MyPageLayout>
    );
}