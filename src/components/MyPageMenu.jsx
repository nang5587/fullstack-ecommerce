import { FiUser, FiHeart } from 'react-icons/fi';
import { RiShoppingBagLine } from 'react-icons/ri';

export default function MyPageMenu({ selectedTab, onChangeTab }) {
    const tabs = [
        { id: 'orders', label: '주문목록', icon: <RiShoppingBagLine /> },
        { id: 'wishlist', label: '위시리스트', icon: <FiHeart /> },
        { id: 'profile', label: '회원정보', icon: <FiUser /> },
    ];

    const onChange = (id) => {

    }

    return (
        <div className='w-40 flex flex-col gap-2 border-r border-gray-200 pr-4'>
            {tabs.map(tab => (
                <button
                    key={tab.id}
                    onClick={()=> onChangeTab(tab.id)}
                    className={`flex items-center gap-2 px-3 py-2 text-left rounded-md transition
                                ${selectedTab === tab.id ? 'bg-gray-100 font-semibold text-bold' : 'text-gray-500 hover:bg-gray-50 hover:text-kalani-gold'}`}  
                >
                    {tab.icon}
                    {tab.label}
                </button>
            ))}
        </div>
    )
}
