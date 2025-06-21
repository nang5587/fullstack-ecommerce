import { createContext, useState, useContext, useEffect } from 'react';
import jwtDecode from 'jwt-decode';

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Context를 제공하는 Provider 컴포넌트 생성
export function AuthProvider({ children }) {
    // localStorage에서 토큰을 확인하여 초기 로그인 상태를 설정합니다.
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('accessToken'));
    const [username, setUsername] = useState('');


    useEffect(() => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            try {
                const decoded = jwtDecode(token);
                setUsername(decoded.username);
                setIsLoggedIn(true);
            } catch (err) {
                console.error('토큰 디코딩 실패', err);
                localStorage.removeItem('accessToken');
            }
        }
    }, []);

    // 로그인 함수 (실제로는 API 호출 후 성공 시 호출)
    const login = (token) => {
        try {
            console.log("1")
            const decoded = jwtDecode(token);
            console.log("2")
            console.log(decoded)
            localStorage.setItem('accessToken', token);
            console.log("3")
            setUsername(decoded.username);
            console.log("4")
            setIsLoggedIn(true);
        } catch (err) {
            console.error('로그인 실패: 잘못된 토큰', err);
        }
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('cart'); // 로그아웃 시 토큰 제거
        localStorage.removeItem('orderItems'); // 로그아웃 시 토큰 제거
        setUsername('');
        setIsLoggedIn(false);
    };

    // Context를 통해 전달할 값
    const value = { isLoggedIn, login, logout, username };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// 3. 다른 컴포넌트에서 쉽게 Context를 사용하게 해주는 커스텀 훅
export function useAuth() {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}