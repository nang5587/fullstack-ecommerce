import { useState, useEffect } from 'react';
import api from '../api/axios';
import TailButton from '../UI/TailButton';
import { FaMapMarkerAlt, FaTrash, FaPen, FaPlus } from 'react-icons/fa';
import AddressInput from './AddressInput';

// ------------------- 하위 UI 컴포넌트들 (수정됨) -------------------

// 1. 주소 목록을 보여주는 부분
function AddressListView({ addresses, onAdd, onEdit, onDelete, onSetDefault }) {
    return (
        <div className="flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-4 text-center">배송지 관리</h3>
            <div className="flex-grow overflow-y-auto pr-2 space-y-3">
                {addresses.map(addr => (
                    <div key={addr.addressId} className="p-4 border rounded-2xl bg-slate-50">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-lg">
                                    {addr.name}
                                    {addr.isMain && <span className="text-xs font-bold text-kalani-gold ml-2">기본</span>}
                                </p>
                                <p className="text-gray-600 text-sm mt-1">({addr.zip}) {addr.address1}</p>
                                <p className="text-gray-600 text-sm">{addr.address2}</p>
                                <p className="text-gray-500 text-sm mt-1">{addr.phone}</p>
                            </div>
                            <div className="flex gap-2 text-gray-500">
                                <button onClick={() => onEdit(addr)} className="hover:text-kalani-gold"><FaPen /></button>
                                <button onClick={() => onDelete(addr)} className="hover:text-kalani-gold"><FaTrash /></button>
                            </div>
                        </div>
                        {!addr.isMain && (
                            <TailButton onClick={() => onSetDefault(addr)} size="xs" className="mt-2">
                                <FaMapMarkerAlt className="mr-1" /> 기본 배송지로 설정
                            </TailButton>
                        )}
                    </div>
                ))}
                {(!addresses || addresses.length === 0) && (
                    <div className="text-center text-gray-500 py-10">저장된 배송지가 없습니다.</div>
                )}
            </div>
            <div className="mt-4">
                <TailButton onClick={onAdd} className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2">
                    <FaPlus /> 새 배송지 추가
                </TailButton>
            </div>
        </div>
    );
}

// 2. 주소를 추가/수정하는 폼 부분 (필드 추가됨)
function AddressForm({ initialData, onSave, onCancel }) {
    const [formData, setFormData] = useState(initialData || { name: '', phone: '', zip: '', address1: '', address2: '' });

    useEffect(() => {
        setFormData(initialData || { name: '', phone: '', zip: '', address1: '', address2: '' });
    }, [initialData]);

    const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    const handlePostcodeComplete = (data) => setFormData(prev => ({ ...prev, zip: data.zip, address1: data.address1 }));
    const handleSubmit = (e) => { e.preventDefault(); onSave(formData); };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
            <h3 className="text-2xl font-bold mb-6 text-center">{initialData ? '주소 수정' : '새 주소 추가'}</h3>
            <div className="space-y-4 text-lg flex-grow">
                <div>
                    <input type="text" name="name" placeholder="수령인 이름" value={formData.name} onChange={handleChange} className="w-full border rounded-xl px-3 py-2" />
                </div>
                <div>
                    <input type="tel" name="phone" placeholder="연락처 ('-' 없이 입력)" value={formData.phone} onChange={handleChange} className="w-full border rounded-xl px-3 py-2" />
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" name="zip" placeholder="우편번호" value={formData.zip} readOnly className="w-full border rounded-xl px-3 py-2 bg-gray-100" />
                    <AddressInput onComplete={handlePostcodeComplete} />
                </div>
                <div>
                    <input type="text" name="address1" placeholder="기본 주소" value={formData.address1} readOnly className="w-full border rounded-xl px-3 py-2 bg-gray-100" />
                </div>
                <div>
                    <input type="text" name="address2" placeholder="상세 주소" value={formData.address2} onChange={handleChange} className="w-full border rounded-xl px-3 py-2" />
                </div>
            </div>
            <div className="flex justify-between mt-8 gap-4">
                <TailButton type="button" onClick={onCancel} className="w-full bg-gray-300 text-black py-2 rounded-xl">취소</TailButton>
                <TailButton type="submit" className="w-full bg-black text-white py-2 rounded-xl">저장</TailButton>
            </div>
        </form>
    );
}

// ------------------- 메인 로직 컴포넌트 (API 호출 로직 수정됨) -------------------

export default function EditAddressForm({ initialAddresses, onDataChange, onCancel }) {
    const [addresses, setAddresses] = useState(initialAddresses || []);

    const [view, setView] = useState('list');
    const [editingAddress, setEditingAddress] = useState(null);

    // ✅ 2. 부모로부터 받은 initialAddresses가 바뀔 때마다 내부 상태를 업데이트합니다.
    useEffect(() => {
        console.log("부모로부터 새로운 주소 목록을 받았습니다. 화면을 갱신합니다.", initialAddresses);

        // ✅ 해결책: 항상 새로운 배열을 생성하여 상태를 업데이트합니다.
        //    initialAddresses를 그대로 쓰는 대신, [...initialAddresses]로
        //    '얕은 복사(shallow copy)'를 하여 새로운 배열 참조를 만듭니다.
        if (initialAddresses) {
            setAddresses([...initialAddresses]);
        } else {
            setAddresses([]);
        }
    }, [initialAddresses]);

    const handleAdd = () => { setEditingAddress(null); setView('add'); };
    const handleEdit = (address) => { setEditingAddress(address); setView('edit'); };

    // ✅ 주소 삭제 API 호출
    const handleDelete = async (addressToDelete) => {
        if (addressToDelete.isMain) {
            alert("기본 배송지는 삭제할 수 없습니다.\n다른 주소를 기본 배송지로 설정한 후 다시 시도해주세요.");
            return;
        }
        if (window.confirm("정말로 이 주소를 삭제하시겠습니까?")) {
            try {
                await api.patch('/api/member/addressDelete', { addressId: addressToDelete.addressId });
                alert("주소가 삭제되었습니다.");
                onDataChange();
            } catch (err) {
                alert("주소 삭제에 실패했습니다.");
            }
        }
    };

    // ✅ 주소 추가/수정 API 호출
    const handleSaveForm = async (formData) => {
        try {
            if (view === 'edit') { // 수정 모드
                // ✅ 해결책 1: 수정 시 필요한 필드만 명시적으로 골라서 객체를 만듭니다.
                const dataToUpdate = {
                    addressId: editingAddress.addressId, // 원본에서 ID 가져오기
                    name: formData.name,
                    zip: formData.zip,
                    address1: formData.address1,
                    address2: formData.address2,
                    phone: formData.phone,
                    isMain: editingAddress.isMain, // isMain 상태는 원본에서 가져오기
                };

                console.log("백엔드로 수정할 최종 데이터:", dataToUpdate);
                await api.patch('/api/member/addressUpdate', dataToUpdate);
                alert("주소가 수정되었습니다.");

            } else { // 추가 모드
                // ✅ 해결책 2: 추가 시 필요한 필드만 명시적으로 골라서 객체를 만듭니다.
                const dataToAdd = {
                    name: formData.name,
                    zip: formData.zip,
                    address1: formData.address1,
                    address2: formData.address2,
                    phone: formData.phone,
                    isMain: false, // 새 주소는 항상 isMain: false
                };

                console.log("백엔드로 추가할 최종 데이터:", dataToAdd);
                await api.post('/api/member/addressAdd', dataToAdd);
                alert("새 주소가 추가되었습니다.");
            }

            onDataChange();
            setView('list');

        } catch (err) {
            console.error("4. [API 에러]", err.response || err);
            console.error("주소 저장 실패:", err); // 디버깅을 위해 에러 전체를 출력
            alert("주소 저장에 실패했습니다.");
        }
    };

    // ✅ 기본 배송지 설정 API 호출
    const handleSetDefault = async (addressToSet) => {
        try {
            // isMain을 true로 설정하여 수정 API 호출
            // API 명세에 따라 전송할 객체를 구성합니다.
            const dataToUpdate = {
                addressId: addressToSet.addressId,
                name: addressToSet.name,
                zip: addressToSet.zip,
                address1: addressToSet.address1,
                address2: addressToSet.address2,
                phone: addressToSet.phone,
                isMain: true,
            };
            await api.patch('/api/member/addressUpdate', dataToUpdate);
            onDataChange();
        } catch (err) {
            alert("기본 배송지 설정에 실패했습니다.");
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-center flex-grow">배송지 관리</h3>
                <TailButton onClick={onCancel} className="bg-gray-200 !px-4 !py-2">닫기</TailButton>
            </div>

            <div className="flex-grow">
                {view === 'list' ? (
                    <AddressListView
                        addresses={addresses}
                        onAdd={handleAdd}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                    />
                ) : (
                    <AddressForm
                        initialData={editingAddress}
                        onSave={handleSaveForm}
                        onCancel={() => setView('list')}
                    />
                )}
            </div>
        </div>
    );
}