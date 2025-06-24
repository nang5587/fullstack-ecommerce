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
            
            <div className="flex-grow overflow-y-auto pr-2 space-y-3 scrollbar-hide">
                {addresses.map(addr => (
                    <div key={addr.addressId} className="p-4 border border-gray-400 rounded-2xl">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-semibold text-lg">
                                    {addr.name}
                                    {addr.main && <span className="text-xs font-bold text-kalani-gold ml-2">기본</span>}
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
                        {!addr.main && (
                            <TailButton onClick={() => onSetDefault(addr)} size="xs" className="mt-2 p-1">
                                <FaMapMarkerAlt className="mr-1" /> 기본 배송지로 설정
                            </TailButton>
                        )}
                    </div>
                ))}
                {(!addresses || addresses.length === 0) && (
                    <div className="text-center text-gray-500 py-10">저장된 배송지가 없습니다.</div>
                )}
            </div>
            <div className="mt-4 flex-shrink-0">
                <TailButton onClick={onAdd} className="w-full bg-black text-white text-lg py-3 rounded-xl flex items-center justify-center gap-2">
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
            {/* <h3 className="text-2xl font-bold mb-6 text-center">{initialData ? '주소 수정' : '새 주소 추가'}</h3> */}
            <div className="space-y-4 text-lg flex-grow">
                <div>
                    <input type="text" name="name" placeholder="수령인 이름" value={formData.name} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div>
                    <input type="tel" name="phone" placeholder="연락처 ('-' 없이 입력)" value={formData.phone} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
                </div>
                <div className="flex items-center gap-2">
                    <input type="text" name="zip" placeholder="우편번호" value={formData.zip} readOnly className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-100" />
                    <div className=''>
                    <AddressInput onComplete={handlePostcodeComplete} />
                    </div>
                </div>
                <div>
                    <input type="text" name="address1" placeholder="기본 주소" value={formData.address1} readOnly className="w-full border border-gray-200 rounded-xl px-3 py-2 bg-gray-100" />
                </div>
                <div>
                    <input type="text" name="address2" placeholder="상세 주소" value={formData.address2} onChange={handleChange} className="w-full border border-gray-200 rounded-xl px-3 py-2" />
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

export default function EditAddressForm({ addresses, onDataChange, onCancel }) {
    const [editingAddress, setEditingAddress] = useState(null);

    const [mode, setMode] = useState('list');
    const handleAdd = () => { setEditingAddress(null); setMode('add'); };
    const handleEdit = (address) => { setEditingAddress(address); setMode('edit'); };

    // ✅ 주소 삭제 API 호출
    const handleDelete = async (addressToDelete) => {
        if (addressToDelete.main) {
            alert("기본 배송지는 삭제할 수 없습니다.\n다른 주소를 기본 배송지로 설정한 후 다시 시도해주세요.");
            return;
        }
        if (window.confirm("정말로 이 주소를 삭제하시겠습니까?")) {
            try {
                console.log("삭제할 : ", addressToDelete.addressId)
                await api.patch('/api/member/addressDelete', addressToDelete.addressId);
                alert("주소가 삭제되었습니다.");
                onDataChange(); // 부모에게 데이터 변경을 알림
            } catch (err) {
                alert("주소 삭제에 실패했습니다.");
            }
        }
    };

    const handleSaveForm = async (formData) => {
        try {
            if (mode === 'edit') { // 수정 모드
                const dataToUpdate = {
                    addressId: editingAddress.addressId,
                    name: formData.name,
                    zip: formData.zip,
                    address1: formData.address1,
                    address2: formData.address2,
                    phone: formData.phone,
                    main: editingAddress.main,
                };
                await api.patch('/api/member/addressUpdate', dataToUpdate);
                alert("주소가 수정되었습니다.");

            } else { // 추가 모드
                const dataToAdd = {
                    name: formData.name,
                    zip: formData.zip,
                    address1: formData.address1,
                    address2: formData.address2,
                    phone: formData.phone,
                    main: (addresses && addresses.length === 0), // 주소가 하나도 없으면 첫 주소를 기본으로 설정
                };
                await api.post('/api/member/addressAdd', dataToAdd);
                alert("새 주소가 추가되었습니다.");
            }

            onDataChange(); // 부모에게 데이터 변경을 알림
            setMode('list');  // 목록 뷰로 돌아가기

        } catch (err) {
            console.error("주소 저장 실패:", err.response || err);
            alert("주소 저장에 실패했습니다.");
        }
    };

    // ✅ 기본 배송지 설정 API 호출
    const handleSetDefault = async (addressToSet) => {
        try {
            const dataToUpdate = { ...addressToSet, main: true };
            await api.patch('/api/member/addressUpdate', dataToUpdate);
            console.log("백앤드로 보낸 기본배송지 : ", dataToUpdate);
            onDataChange(); // 부모에게 데이터 변경을 알림
        } catch (err) {
            alert("기본 배송지 설정에 실패했습니다.");
        }
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 flex-shrink-0">
                <h3 className="text-2xl font-bold">
                    {mode === 'list' ? '배송지 관리' : (mode === 'add' ? '새 주소 추가' : '주소 수정')}
                </h3>
                <TailButton onClick={onCancel} className="bg-gray-200 !px-4 !py-2">닫기</TailButton>
            </div>

            <div className="flex-grow overflow-y-auto">
                {mode === 'list' ? (
                    <AddressListView
                        // ✅ 부모로부터 받은 addresses prop을 그대로 전달합니다.
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
                        onCancel={() => setMode('list')}
                    />
                )}
            </div>
        </div>
    );
}