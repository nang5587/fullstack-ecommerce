// UI 목록
import TailInput from "../UI/TailInput";
import TailButton from "../UI/TailButton";

// 훅 목록
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext"
import { useLocation, useNavigate } from "react-router-dom";

// 아이콘 목록
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FcGoogle } from 'react-icons/fc';

// ✅ 1. 설정된 axios 인스턴스(api)를 import 합니다.
import api from '../api/axios';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const redirect = new URLSearchParams(location.search).get('redirect');

    // 로그인 관리 변수
    const [username, setusername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // 포커스 이동용
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);

    // 로그인 함수
    const handleLogin = async () => {
        setErrorMsg("");
        if (!username) {
            setErrorMsg("아이디를 입력해주세요.");
            usernameRef.current.focus();
            return;
        }
        if (!password) {
            setErrorMsg("비밀번호를 입력해주세요.");
            passwordRef.current.focus();
            return;
        }

        setLoading(true);

        const isMock = import.meta.env.VITE_DEV_FAKE_LOGIN === 'true';
        if (isMock) {
            const fakeToken = "test-dev-token";
            localStorage.setItem('accessToken', fakeToken);
            login(fakeToken);
            navigate(redirect || "/");
            return;
        }

        try {
            // ✅ 2. fetch 대신 'api.post'를 사용합니다.
            // baseURL은 api 인스턴스에 이미 설정되어 있으므로 뒷부분 경로만 적어줍니다.
            // body 데이터는 두 번째 인자로 전달합니다.
            const response = await api.post('/api/public/login', { username, password });

            // ✅ 3. axios는 응답 헤더를 response.headers에서 바로 접근할 수 있습니다.
            // 'authorization' 헤더를 소문자로 접근하는 것이 더 안전합니다.
            let authToken = response.headers['authorization'];

            if (authToken) {
                authToken = authToken.replace("Bearer ", "");
                localStorage.setItem('accessToken', authToken);
                console.log('로그인 성공! 토큰을 저장했습니다.');
                
                login(authToken);
                navigate(redirect || "/");
            } else {
                // 이 경우는 보통 백엔드에서 토큰을 보내주지 않은 경우입니다.
                setErrorMsg("로그인에 실패했습니다. (토큰 없음)");
                console.error('응답 헤더에 토큰이 없습니다.');
            }

        } catch (error) {
            // ✅ 4. axios는 2xx가 아닌 응답을 받으면 자동으로 에러를 throw합니다.
            // 에러 메시지는 error.response.data에서 더 자세히 확인할 수 있습니다.
            const message = error.response?.data?.message || "서버와 통신 중 오류가 발생했습니다.";
            setErrorMsg(message);
            console.error("로그인 실패:", error.response || error);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyDown = (event) => {
        if (event.key === 'Enter' && !loading) {
            handleLogin();
        }
    }

    return (
        <div className="w-full flex items-center justify-center bg-kalani-navy min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
                <div className="hidden md:block w-full h-full">
                    <img
                        src="/src/assets/loginImg/2.jpg" // public 폴더 기준 경로로 수정하는 것이 좋습니다.
                        alt="Brand identity"
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="w-full bg-white flex flex-col justify-center p-8 sm:p-12 lg:p-16">
                    <p id="font" className="text-kalani-navy text-4xl text-center mb-8 tracking-widest">KALANI</p>
                    <p className="text-center text-sm text-gray-600 mb-8">
                        아직 회원이 아니신가요? <a href="/signup" className="font-semibold text-kalani-gold hover:underline">회원가입</a>
                    </p>

                    <div className="flex flex-col gap-5">
                        <TailInput label="아이디" type="text" value={username} onChange={(e) => setusername(e.target.value)} ref={usernameRef} onKeyDown={handleKeyDown} />
                        <TailInput label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} ref={passwordRef} onKeyDown={handleKeyDown} />
                    </div>

                    <div className="flex justify-end gap-4 mt-3 text-sm text-kalani-taupe font-medium">
                        <a href="#" className="hover:text-kalani-ash transition-colors">비밀번호 찾기</a>
                        <a href="#" className="hover:text-kalani-ash transition-colors">아이디 찾기</a>
                    </div>

                    <div className={`transition-all duration-300 ${errorMsg ? 'mt-6 opacity-100' : 'opacity-0 h-0'}`}>
                        {errorMsg && (
                            <div className="p-3 flex items-center gap-3 text-sm rounded-lg bg-red-50 text-red-700">
                                <FontAwesomeIcon icon={faCircleExclamation} />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                    </div>


                    <div className="mt-8 flex flex-col gap-3">
                        <TailButton variant="navy" onClick={handleLogin} disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"}
                        </TailButton>
                    </div>

                    <div className="my-8 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400">또는</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <TailButton variant="selGhost" onClick={() => { }}>
                            <FcGoogle size={22} />
                            <span>구글로 로그인</span>
                        </TailButton>
                        <TailButton variant="naver" onClick={() => { }}>
                            <img src="/src/assets/icons/naver_logo.png" alt="Naver logo" className="w-5 h-5" />
                            <span>네이버로 로그인</span>
                        </TailButton>
                    </div>
                </div>
            </div>
        </div>
    );
}