import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TailButton from '../UI/TailButton';
import ErrorMessage from '../components/ErrorMessage';
import api from '../api/axios';

export default function VerifyPassword() {
    const [password, setPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    const handleVerify = async () => {
        try {
            const baseUrl = import.meta.env.VITE_BACKEND_URL;
            const token = localStorage.getItem('accessToken');

            const res = await fetch(`http://${baseUrl}/api/member/verify-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ password })
            });

            if (res.ok) {
                navigate('/mypage/edit');
            } else {
                setErrorMsg('비밀번호가 일치하지 않습니다.');
            }
        } catch (err) {
            setErrorMsg('서버 오류가 발생했습니다.');
        }
    };

    return (
        <div className="p-8">
            <h2 className="text-lg font-bold mb-4">비밀번호 확인</h2>
            <input
                type="password"
                placeholder="비밀번호 입력"
                className="border p-2 w-full mb-4"
                value={password}
                onChange={e => setPassword(e.target.value)}
            />
            <TailButton variant="navy" onClick={handleVerify}>확인</TailButton>
            <ErrorMessage errorMsg={errorMsg} />
        </div>
    );
}
