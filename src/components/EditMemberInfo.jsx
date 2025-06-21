import { useState, useEffect } from 'react';
import TailButton from '../UI/TailButton';

export default function EditMemberInfo() {
    const [form, setForm] = useState({
        nickname: '',
        gender: '',
        email: '',
        birth: '',
        password: '',
        confirmPassword: ''
    });

    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const token = localStorage.getItem('accessToken');

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://${baseUrl}/api/member/info`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            setForm(prev => ({ ...prev, ...data }));
        };
        fetchData();
    }, []);

    const handleChange = e => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async () => {
        if (form.password !== form.confirmPassword) return alert("비밀번호가 일치하지 않아요!");

        await fetch(`http://${baseUrl}/api/member/update`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(form)
        });

        alert("수정 완료!");
    };

    return (
        <div className="p-8 space-y-4">
            <input name="nickname" value={form.nickname} onChange={handleChange} placeholder="이름" />
            <input name="email" value={form.email} onChange={handleChange} placeholder="이메일" />
            <input name="birth" value={form.birth} onChange={handleChange} placeholder="생일" />
            <select name="gender" value={form.gender} onChange={handleChange}>
                <option value="여성">여성</option>
                <option value="남성">남성</option>
            </select>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="새 비밀번호" />
            <input type="password" name="confirmPassword" value={form.confirmPassword} onChange={handleChange} placeholder="비밀번호 확인" />

            <TailButton variant="navy" onClick={handleSubmit}>정보 수정</TailButton>
        </div>
    );
}
