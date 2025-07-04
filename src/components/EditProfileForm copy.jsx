import { useState } from "react";
import TailButton from "../UI/TailButton";

export default function EditProfileForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        nickname: initialData.nickname || '',
        phone: initialData.phone || '',
        gender: initialData.gender || '',
        birth: initialData.birth || '',
        username: initialData.username || '',
        email: initialData.email || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // await api.put('/api/members/update', formData);
            onSave(formData);
        } catch (err) {
            console.error("수정 실패", err);
            alert("수정에 실패했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 gap-3 text-lg text-gray-700">
                {/* 이름 + 성별 */}
                <div className="col-span-1">
                    <label className="block mb-1 font-semibold"></label>
                    <input
                        type="text"
                        name="nickname"
                        value={formData.nickname}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2"
                    />
                </div>
                <div className="col-span-1">
                    <label className="block mb-1 font-semibold"></label>
                    <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2"
                    >
                        <option value="">선택</option>
                        <option value="FEMALE">여성</option>
                        <option value="MALE">남성</option>
                    </select>
                </div>

                {/* 전화번호 */}
                <div className="col-span-2">
                    <label className="block mb-1 font-semibold"></label>
                    <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2"
                    />
                </div>

                {/* 생년월일 */}
                <div className="col-span-2">
                    <label className="block mb-1 font-semibold"></label>
                    <input
                        type="date"
                        name="birth"
                        value={formData.birth}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2"
                    />
                </div>

                <div className="col-span-2">
                    <label className="block mb-1 font-semibold"></label>
                    <input
                        type="text"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border rounded-xl px-3 py-2"
                    />
                </div>

                {/* 아이디 */}
                <div className="col-span-2">
                    <label className="block mb-1 font-semibold"></label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        readOnly
                        className="w-full bg-gray-100 border rounded-xl px-3 py-2"
                    />
                </div>

                <div className="col-span-1">
                    <label className="block mb-1 font-semibold"></label>
                    <TailButton
                        type="button"
                        onClick={() => alert("비밀번호 변경 기능 구현 예정")}
                        className="w-full text-center bg-white py-2 rounded-xl hover:bg-gray-200"
                    >
                        비밀번호 변경
                    </TailButton>
                </div>
                <div className="col-span-1">
                    <label className="block mb-1 font-semibold"></label>
                    <TailButton
                        type="button"
                        onClick={() => alert("비밀번호 변경 기능 구현 예정")}
                        className="w-full text-center bg-white py-2 rounded-xl hover:bg-gray-200"
                    >
                        주소 변경
                    </TailButton>
                </div>

            </div>
                <div className="flex justify-between mt-5 gap-4">
                    <TailButton
                        type="button"
                        onClick={onCancel}
                        className="w-full text-lg bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-xl"
                    >
                        취소
                    </TailButton>
                    <TailButton
                        type="submit"
                        className="w-full text-lg bg-black hover:bg-kalani-gold text-white py-2 rounded-xl"
                    >
                        저장
                    </TailButton>
                </div>
        </form>
    );
}
