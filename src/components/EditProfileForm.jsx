// EditProfileForm.js

import TailButton from "../UI/TailButton";
import { useState } from "react";

// 부모의 상태를 제어할 함수들을 props로 받습니다.
export default function EditProfileForm({
    initialData,
    onSave,
    onCancel,
    onNavigateToAddressEdit,
    onNavigateToPasswordEdit
}) {
    const [formData, setFormData] = useState({
        // ... (내부 상태 로직은 동일)
        nickname: initialData.nickname || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        birth: initialData.birth || '',
        username: initialData.username || '',
        email: initialData.email || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // 전화번호 하이픈 자동 삽입
        if (name === 'phone') {
            const raw = value.replace(/\D/g, ''); // 숫자만 남김
            let formatted = raw;

            if (raw.length <= 3) {
                formatted = raw;
            } else if (raw.length <= 7) {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3)}`;
            } else if (raw.length <= 11) {
                formatted = `${raw.slice(0, 3)}-${raw.slice(3, 7)}-${raw.slice(7, 11)}`;
            }

            setFormData((prev) => ({ ...prev, [name]: formatted }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const { nickname, phone, gender, birth, email } = formData;
        onSave({ nickname, phone, gender, birth, email });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 gap-3 text-lg text-gray-700">
                {/* ... (다른 input 필드들은 동일) ... */}
                <div className="col-span-1"><input type="text" name="nickname" value={formData.nickname} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" /></div>
                <div className="col-span-1">
                    <select name="gender" value={formData.gender} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2">
                        <option value="">선택</option><option value="FEMALE">여성</option><option value="MALE">남성</option>
                    </select>
                </div>
                <div className="col-span-2"><input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" /></div>
                <div className="col-span-2"><input type="date" name="birth" value={formData.birth} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" /></div>
                <div className="col-span-2"><input type="text" name="email" value={formData.email} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" /></div>
                <div className="col-span-2"><input type="text" name="username" value={formData.username} readOnly className="w-full bg-gray-100 border border-gray-200 rounded-xl px-3 py-2" /></div>

                {/* 여기가 핵심: 버튼 클릭 시 부모로부터 받은 함수를 호출 */}
                <div className="col-span-1">
                    <TailButton type="button" onClick={onNavigateToPasswordEdit} className="w-full text-center bg-white py-2 rounded-xl hover:bg-gray-200 border">
                        비밀번호 변경
                    </TailButton>
                </div>
                <div className="col-span-1">
                    <TailButton type="button" onClick={onNavigateToAddressEdit} className="w-full text-center bg-white py-2 rounded-xl hover:bg-gray-200 border">
                        주소 변경
                    </TailButton>
                </div>
            </div>
            <div className="flex justify-between mt-5 gap-4">
                <TailButton type="button" onClick={onCancel} className="w-full text-lg bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-xl">
                    취소
                </TailButton>
                <TailButton type="submit" className="w-full text-lg bg-black hover:bg-kalani-gold text-white py-2 rounded-xl">
                    저장
                </TailButton>
            </div>
        </form>
    );
}