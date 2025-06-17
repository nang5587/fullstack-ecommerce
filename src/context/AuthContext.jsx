import { createContext, useState, useContext, useEffect } from 'react';

// 1. Context 생성
const AuthContext = createContext(null);

// 2. Context를 제공하는 Provider 컴포넌트 생성
export function AuthProvider({ children }) {
    // localStorage에서 토큰을 확인하여 초기 로그인 상태를 설정합니다.
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

    // 로그인 함수 (실제로는 API 호출 후 성공 시 호출)
    const login = () => {
        // 실제로는 토큰을 받아와서 저장해야 하지만, 여기서는 상태만 변경
        setIsLoggedIn(true);
    };

    // 로그아웃 함수
    const logout = () => {
        localStorage.removeItem('token'); // 로그아웃 시 토큰 제거
        setIsLoggedIn(false);
    };

    // Context를 통해 전달할 값
    const value = { isLoggedIn, login, logout };

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