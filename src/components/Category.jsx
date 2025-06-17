// 훅 목록
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 카테고리 EN -> KR
import categoryKR from "../local/categoryKR";

export default function Category({ isCateOpen, onClose }) {
    const [category, setCategory] = useState([]);
    const [selectMain, setSelectMain] = useState("top");
    const [hoveredMid, setHoverMid] = useState(null);

    const selectedMainCategory = category.find(cat => cat.main === selectMain);
    const midCategory = selectedMainCategory?.midList || [];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await fetch(`http://${baseUrl}/api/public/categoryTree`);
                const data = await res.json();
                setCategory(data.categoryTree);

            }
            catch (err) {
                console.error("카테고리를 불러오는 데 실패함: ", err);
            }
        };
        fetchProducts()
    }, []);

    useEffect(() => {
        if (!isCateOpen) return;
        setSelectMain("top");
        setHoverMid(null);
    }, [isCateOpen]);

    return (
        <>
            <div className="flex min-h-screen overflow-y-auto w-full">

                {/* 대분류 */}
                <div className="w-48 bg-kalani-beige flex flex-col">
                    {category.map((cate) => (
                        <button
                            key={cate.main}
                            className={`text-sm font-bold text-kalani-navy text-left p-4 ${selectMain === cate.main
                                ? "bg-white"
                                : "hover:bg-white"
                                }`}
                            onClick={() => {
                                setSelectMain(cate.main);
                                setHoverMid(null);
                            }}
                        >
                            {categoryKR[cate.main] || cate.main}
                        </button>
                    ))}
                </div>

                {/* 중분류와 소분류 드롭다운 */}
                <ul className="w-48 p-4 space-y-2 overflow-y-auto">
                    <li>
                        <div
                            className="cursor-pointer p-2 text-sm font-bold text-gray-800 hover:text-kalani-navy"
                            onClick={() => {
                                navigate(`/products?main=${selectMain}`);
                                onClose();
                            }}
                        >
                            전체
                        </div>
                    </li>
                    {midCategory.map((mid, idx) => (
                        <li
                            key={mid.mid}
                            onMouseEnter={() => setHoverMid(idx)}
                            onMouseLeave={() => setHoverMid(null)}
                        >
                            <div className="cursor-pointer p-2 text-sm hover:text-kalani-navy"
                                onClick={() => {
                                    navigate(`/products?main=${selectMain}&mid=${mid.mid}`);
                                    onClose();
                                }}
                            >
                                {categoryKR[mid.mid] || mid.mid}
                            </div>
                            {/* 드롭다운 */}
                            {hoveredMid === idx && (
                                <ul className="mt-1 ml-2 p-3 shadow-inner space-y-1">
                                    {mid.detailList.map((sub, i) => (
                                        <li key={i}
                                            className="pb-2 pl-2 text-sm cursor-pointer bg-kalani-beige text-kalani-navy"
                                            onClick={() => {
                                                navigate(`/products?main=${selectMain}&mid=${mid.mid}&sub=${sub}`);
                                                onClose();
                                            }}
                                        >
                                            {categoryKR[sub] || sub}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </>
    )
}
