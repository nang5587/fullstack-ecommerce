import { useState } from "react";
import TailButton from "../UI/TailButton";

export default function ChangePasswordForm({ onSave, onCancel }) {
    const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '', confirmNewPassword: '' });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPasswords(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmNewPassword) {
            alert("새 비밀번호가 일치하지 않습니다.");
            return;
        }
        alert("비밀번호가 변경되었습니다. (가상)");
        onSave();
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full p-4">
            <h3 className="text-2xl font-bold mb-6 text-left text-black">비밀번호 변경</h3>
            <div className="space-y-4 text-lg">
                <div><input type="password" name="currentPassword" placeholder="현재 비밀번호" value={passwords.currentPassword} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" autoComplete="current-password" /></div>
                <div><input type="password" name="newPassword" placeholder="새 비밀번호" value={passwords.newPassword} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" autoComplete="new-password" /></div>
                <div><input type="password" name="confirmNewPassword" placeholder="새 비밀번호 확인" value={passwords.confirmNewPassword} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" autoComplete="new-password" /></div>
            </div>
            <div className="flex justify-between mt-8 gap-4">
                <TailButton type="button" onClick={onCancel} className="w-full text-lg bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-xl">취소</TailButton>
                <TailButton type="submit" className="w-full text-lg bg-black hover:bg-kalani-gold text-white py-2 rounded-xl">변경</TailButton>
            </div>
        </form>
    );
}