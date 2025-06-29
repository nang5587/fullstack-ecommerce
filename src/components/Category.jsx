import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import categoryKR from "../local/categoryKR";
import api from "../api/axios";

export default function Category({ isCateOpen, onClose }) {
    const [category, setCategory] = useState([]);
    const [selectMain, setSelectMain] = useState("top");
    const [hoveredMid, setHoverMid] = useState(null);
    const navigate = useNavigate();

    const selectedMainCategory = category.find((cat) => cat.main === selectMain);
    const midCategory = selectedMainCategory?.midList || [];

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                // const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await api.get("/api/public/categoryTree");
                // console.log()
                // const res = await fetch(`http://${baseUrl}/api/public/categoryTree`);
                // const data = await res.json();
                setCategory(res.data.categoryTree);
                // setCategory(data.categoryTree);
            } catch (err) {
                console.error("카테고리를 불러오는 데 실패함: ", err);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        if (!isCateOpen) return;
        setSelectMain("top");
        setHoverMid(null);
    }, [isCateOpen]);

    return (
        <div className="flex min-h-screen w-[450px] bg-white overflow-hidden border border-gray-200 rounded">
            {/* 대분류 */}
            <nav className="w-[160px] bg-gray-50 flex flex-col">
                <div
                    className="cursor-pointer px-4 py-3 text-sm font-semibold text-gray-800 hover:bg-white"
                    onClick={() => {
                        navigate(`/products`);
                        onClose();
                    }}
                >
                    전체
                </div>
                {category.map((cate) => (
                    <button
                        key={cate.main}
                        className={`text-sm font-semibold text-gray-800 text-left px-4 py-3 cursor-pointer ${selectMain === cate.main ? "bg-white" : "hover:bg-white"
                            }`}
                        onClick={() => {
                            setSelectMain(cate.main);
                            setHoverMid(null);
                        }}
                    >
                        {categoryKR[cate.main] || cate.main}
                    </button>
                ))}
            </nav>

            {/* 중분류 + 소분류 영역 */}
            <div
                className="flex relative w-[290px]"
                onMouseLeave={() => setHoverMid(null)}
            >
                <ul className="w-[160px] p-4 space-y-2 overflow-y-auto">
                    <li>
                        <div
                            className="cursor-pointer px-3 py-2 text-sm font-semibold text-gray-800 rounded hover:bg-gray-100"
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
                            className={`cursor-pointer px-3 py-2 rounded text-gray-800 hover:bg-gray-100 ${hoveredMid === idx ? "bg-gray-200 font-semibold" : ""
                                }`}
                        >
                            <div
                                onClick={() => {
                                    navigate(`/products?main=${selectMain}&mid=${mid.mid}`);
                                    onClose();
                                }}
                            >
                                {categoryKR[mid.mid] || mid.mid}
                            </div>
                        </li>
                    ))}
                </ul>

                {hoveredMid !== null && (
                    <ul
                        className="absolute top-0 left-[160px] h-full w-[130px] bg-white pr-4 py-4"
                    >
                        {midCategory[hoveredMid].detailList.map((sub, i) => (
                            <li
                                key={i}
                                className="px-3 py-2 text-gray-700 hover:bg-gray-200 cursor-pointer rounded transition-colors duration-200"
                                onClick={() => {
                                    navigate(
                                        `/products?main=${selectMain}&mid=${midCategory[hoveredMid].mid}&sub=${sub}`
                                    );
                                    onClose();
                                }}
                            >
                                {categoryKR[sub] || sub}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
