import { useState } from "react";
import TailButton from "../UI/TailButton";
import api from '../api/axios';

export default function ChangePasswordForm({ onSave, onCancel }) {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
        // 입력이 변경되면 에러 메시지 초기화
        if (error) setError(''); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(''); // 이전 에러 메시지 초기화
        
        // 1. 프론트엔드에서의 기본 유효성 검사
        if (!passwords.currentPassword || !passwords.newPassword) {
            setError("모든 필드를 입력해주세요.");
            return;
        }
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            setError("새 비밀번호가 일치하지 않습니다.");
            return;
        }

        setIsLoading(true); // 로딩 시작

        try {
            // 2. 백엔드로 보낼 요청 Body(DTO) 구성
            const payload = {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword,
            };

            // 3. axios 인스턴스를 사용하여 API 호출 (보통 PATCH 또는 POST 사용)
            // 🚨 API 명세에 따라 'api/member/password' 또는 '/api/member/password'로 수정
            const response = await api.patch('api/member/password', payload);
            
            // 4. 성공 처리
            console.log('Password changed successfully:', response.data);
            alert("비밀번호가 성공적으로 변경되었습니다.");
            onSave(); // 부모 컴포넌트에 성공 알림

        } catch (err) {
            // 5. 실패 처리
            console.error("Failed to change password:", err);
            // 백엔드에서 내려주는 에러 메시지를 사용하는 것이 더 좋습니다.
            const errorMessage = err.response?.data?.message || "비밀번호 변경에 실패했습니다. 현재 비밀번호를 다시 확인해주세요.";
            setError(errorMessage);
            alert(errorMessage); // 사용자에게도 알림
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full p-4">
            <h3 className="text-2xl font-bold mb-6 text-left text-black">비밀번호 변경</h3>
            <div className="space-y-4 text-lg">
                <div><input type="password" name="currentPassword" placeholder="현재 비밀번호" value={passwords.currentPassword} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" autoComplete="current-password" /></div>
                <div><input type="password" name="newPassword" placeholder="새 비밀번호" value={passwords.newPassword} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" autoComplete="new-password" /></div>
                <div><input type="password" name="confirmNewPassword" placeholder="새 비밀번호 확인" value={passwords.confirmNewPassword} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" autoComplete="new-password" /></div>
            </div>

            {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
            
            <div className="flex justify-between mt-8 gap-4">
                <TailButton type="button" onClick={onCancel} className="w-full text-lg bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-xl">취소</TailButton>
                {/* ✨ 로딩 중일 때 버튼 비활성화 */}
                <TailButton type="submit" className="w-full text-lg bg-black hover:bg-kalani-gold text-white py-2 rounded-xl disabled:bg-gray-500" disabled={isLoading}>
                    {isLoading ? '변경 중...' : '변경'}
                </TailButton>
            </div>
        </form>
    );
}
