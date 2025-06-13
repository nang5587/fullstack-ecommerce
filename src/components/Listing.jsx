// 훅 목록
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import ProductCard from './ProductCard';

export default function Listing() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({});

    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const newFilters = {};

        for (const [key, value] of queryParams.entries()) {
            newFilters[key] = value;
        }

        setFilters(newFilters);
        setPage(1); // 새 필터면 페이지 초기화
    }, [location.search]);

    const fetchProducts = async (pageNumber, append = false) => {
        const params = new URLSearchParams({
            page: pageNumber,
            limit: 20,
            ...filters
        });
        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`http://${baseUrl}/api/public/category?${params.toString()}`);
        const data = await res.json();

        if (data.length < 20) setHasMore(false);

        setProducts(prev => append ? [...prev, ...data] : data);
    };

    useEffect(() => {
        fetchProducts(1);
    }, [filters]);

    const loadData = () => {
        const morePage = page + 1;
        setPage(morePage);
        fetchProducts(morePage, true);
    }

    return (
        <div className="flex px-8 py-6 gap-6">
            <div className="w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white border p-4 sticky top-16">
                <h2 className="text-lg font-bold mb-4">필터</h2>
                {/* 여기에 카테고리/성별/가격 필터 등 구성 */}
                {/* 예시 */}
                <button onClick={() => setFilters({ ...filters, gender: 'women' })}>여성</button>
            </div>

            <main className="flex-1">
                <div className="grid grid-cols-4 gap-6">
                    {products.map(product => (
                        <ProductCard key={product.fullcode} product={product} />
                    ))}
                </div>

                {hasMore && (
                    <div className="text-center mt-8">
                        <button
                            onClick={loadData}
                            className="px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
                        >
                            더 보기
                        </button>
                    </div>
                )}
            </main>
        </div>
    )
}
