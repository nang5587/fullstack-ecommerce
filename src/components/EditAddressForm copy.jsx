import { useState } from "react";
import TailButton from "../UI/TailButton";

export default function EditAddressForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState({
        zip: initialData.zip || '',
        address1: initialData.address1 || '',
        address2: initialData.address2 || '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ zip: formData.zip, address1: formData.address1, address2: formData.address2 });
    };

    return (
        // 1. 최상위 부모 div에 'pointer-events-none'을 추가합니다.
        //    이 div는 이제 투명한 유리판처럼 동작하지만, 마우스 클릭을 통과시킵니다.
        <div className="flex flex-col justify-between h-full p-4 pointer-events-none">

            {/* 제목: 클릭할 일이 없으므로 그대로 둡니다. */}
            <h3 className="text-2xl font-bold mb-6 text-center select-none">주소 정보 수정</h3>

            <form onSubmit={handleSubmit} className="flex flex-col justify-between flex-grow">
                {/* 
                  2. 입력 필드 그룹: 이 그룹 안의 요소들은 마우스 이벤트를 받아야 하므로,
                     'pointer-events-auto'를 추가하여 부모의 설정을 덮어씁니다.
                */}
                <div className="space-y-4 text-lg pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <input type="text" name="zip" placeholder="우편번호" value={formData.zip} onChange={handleChange} className="w-full border rounded-xl px-3 py-2" />
                        <TailButton type="button" onClick={() => alert('우편번호 찾기')} className="bg-gray-200 px-4 py-2 rounded-xl whitespace-nowrap select-none">찾기</TailButton>
                    </div>
                    <div>
                        <input type="text" name="address1" placeholder="기본 주소" value={formData.address1} onChange={handleChange} className="w-full border rounded-xl px-3 py-2" />
                    </div>
                    <div>
                        <input type="text" name="address2" placeholder="상세 주소" value={formData.address2} onChange={handleChange} className="w-full border rounded-xl px-3 py-2" />
                    </div>
                </div>

                {/* 
                  3. 버튼 그룹: 여기도 마찬가지로 'pointer-events-auto'를 추가합니다.
                     버튼의 텍스트가 드래그되지 않도록 'select-none'도 추가합니다.
                */}
                <div className="flex justify-between mt-8 gap-4 pointer-events-auto">
                    <TailButton type="button" onClick={onCancel} className="w-full text-lg bg-gray-300 hover:bg-gray-400 text-black py-2 rounded-xl select-none">취소</TailButton>
                    <TailButton type="submit" className="w-full text-lg bg-black hover:bg-kalani-gold text-white py-2 rounded-xl select-none">저장</TailButton>
                </div>
            </form>
        </div>
    );
}