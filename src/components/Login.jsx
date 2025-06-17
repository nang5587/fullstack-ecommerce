// UI 목록
import TailInput from "../UI/TailInput";
import TailButton from "../UI/TailButton";

// 훅 목록
import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext"
import { useNavigate } from "react-router-dom";

// 아이콘 목록
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';
import { FcGoogle } from 'react-icons/fc';

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    // 로그인 관리 변수
    const [userId, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    // 포커스 이동용
    const userIdRef = useRef(null);
    const passwordRef = useRef(null);

    // 로그인 함수
    const handleLogin = async () => {
        setErrorMsg("");
        if (!userId) {
            setErrorMsg("아이디를 입력해주세요.");
            userIdRef.current.focus();
            return;
        }
        if (!password) {
            setErrorMsg("비밀번호를 입력해주세요.");
            passwordRef.current.focus();
            return;
        }

        setLoading(true);
        try {
            const response = await fetch("api/public/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId, password }),
            });

            if (!response.ok) {
                const data = await response.json();
                setErrorMsg("로그인에 실패했습니다." || data.message)
            }
            else {
                const data = await response.json();
                console.log("로그인 성공", data);
                localStorage.setItem("token", data.token);
                login();
                navigate("/"); // 새로고침 안 해서 부드러운 이동
            }
        }
        catch (error) {
            setErrorMsg("서버와 통신 중 오류가 발생했습니다.")
            console.error(error);
        }
        finally {
            setLoading(false);
        }
    };

    // const baseUrl = import.meta.env.VITE_BACKEND_URL;
    // const handleNaverLogin = () => {
    //     window.location.href = `http://${baseUrl}/oauth2/authorization/naver`;
    // };

    return (
        <div className="w-full flex items-center justify-center bg-kalani-navy min-h-screen p-4 sm:p-6 lg:p-8">
            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 shadow-2xl rounded-2xl overflow-hidden">
                <div className="hidden md:block w-full h-full">
                    <img
                        src="src/assets/loginImg/2.jpg"
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
                        <TailInput label="아이디" type="text" value={userId} onChange={(e) => setUserId(e.target.value)} ref={userIdRef} />
                        <TailInput label="비밀번호" type="password" value={password} onChange={(e) => setPassword(e.target.value)} ref={passwordRef} />
                    </div>

                    <div className="flex justify-end gap-4 mt-3 text-sm text-kalani-taupe font-medium">
                        <a href="#" className="hover:text-kalani-ash transition-colors">비밀번호 찾기</a>
                        <a href="#" className="hover:text-kalani-ash transition-colors">아이디 찾기</a>
                    </div>

                    {/* [디자인 4] 에러 메시지 UI 개선 */}
                    <div className={`transition-all duration-300 ${errorMsg ? 'mt-6 opacity-100' : 'opacity-0 h-0'}`}>
                        {errorMsg && (
                            <div className="p-3 flex items-center gap-3 text-sm rounded-lg bg-red-50 text-red-700">
                                <FontAwesomeIcon icon={faCircleExclamation} />
                                <span>{errorMsg}</span>
                            </div>
                        )}
                    </div>


                    <div className="mt-8 flex flex-col gap-3">
                        <TailButton color="navy" onClick={handleLogin} disabled={loading}>
                            {loading ? "로그인 중..." : "로그인"}
                        </TailButton>
                    </div>

                    {/* [디자인 5] '또는' 구분선 추가 */}
                    <div className="my-8 flex items-center">
                        <div className="flex-grow border-t border-gray-200"></div>
                        <span className="flex-shrink mx-4 text-xs text-gray-400">또는</span>
                        <div className="flex-grow border-t border-gray-200"></div>
                    </div>

                    <div className="flex flex-col gap-3">
                        <TailButton color="google" onClick={() => { }}>
                            <FcGoogle size={22} />
                            <span>구글로 로그인</span>
                        </TailButton>
                        <TailButton color="naver" onClick={() => { }}>
                            <img src="src/assets/icons/naver_logo.png" alt="Naver logo" className="w-5 h-5" />
                            <span>네이버로 로그인</span>
                        </TailButton>
                    </div>
                </div>
            </div>
        </div>
    );
}