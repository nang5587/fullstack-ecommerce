// 훅 목록
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// component 목록
import ProductCard from './ProductCard';
import SidebarFilters from './SidebarFilter';
import SortMenu from './SortMenu';

// 가격 최대와 최소
const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function Listing() {
    const [sortOrder, setSortOrder] = useState('newest');
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [filters, setFilters] = useState({
        gender: [],
        pattern: [], // 'print'를 사용하고 계셨다면 'pattern'으로 통일해주세요.
        color: [],
        mid: [],
        sub: [],
        main: '',
        minPrice: MIN_PRICE,
        maxPrice: MAX_PRICE,
    });
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sortFromUrl = params.get('sort');
        if (sortFromUrl) {
            setSortOrder(sortFromUrl);
        }
        const newFilters = {};

        // URL 파라미터를 객체로 변환
        for (const [key, value] of params.entries()) {
            if (newFilters[key]) {
                // 이미 키가 있으면 배열로 만듦
                newFilters[key] = Array.isArray(newFilters[key])
                    ? [...newFilters[key], value]
                    : [newFilters[key], value];
            } else {
                newFilters[key] = value;
            }
        }

        // SidebarFilters의 형식에 맞게 데이터를 정규화 (매우 중요!)
        const safeArray = (arr) => Array.isArray(arr) ? arr : arr ? [arr] : [];
        const normalized = {
            gender: safeArray(newFilters.gender),
            print: safeArray(newFilters.print),
            color: safeArray(newFilters.color),
            mid: safeArray(newFilters.mid),
            sub: safeArray(newFilters.sub),
            main: newFilters.main || '', // main은 문자열로 처리

            minPrice: newFilters.minPrice ? parseInt(newFilters.minPrice, 10) : MIN_PRICE,
            maxPrice: newFilters.maxPrice ? parseInt(newFilters.maxPrice, 10) : MAX_PRICE,
        };

        // [개선] 상태가 실제로 바뀌었을 때만 업데이트하여 무한 루프 방지
        if (JSON.stringify(normalized) !== JSON.stringify(filters)) {
            setFilters(normalized);
            setPage(1); // 새 필터면 페이지 초기화
        }
    }, [location.search]);


    const fetchProducts = async (pageToFetch, shouldAppend) => {
        const params = new URLSearchParams({
            page: pageToFetch,
            limit: 20,
            sort: sortOrder,
        });

        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (key === 'main' && value) {
                params.set(key, value);
            } else if ((key === 'minPrice' && value !== MIN_PRICE) || (key === 'maxPrice' && value !== MAX_PRICE)) {
                // 가격 필터는 기본값이 아닐 때만 파라미터에 추가합니다.
                params.set(key, value);
            } else if (Array.isArray(value) && value.length > 0) {
                value.forEach((v) => params.append(key, v));
            }
        });

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`http://${baseUrl}/api/public/category/goods?${params.toString()}`);
        const data = await res.json();
        console.log("백엔드 응답:", data);

        const productsArray = data || [];
        setHasMore(productsArray.length === 20);
        if (shouldAppend) {
            setProducts(prevProducts => [...prevProducts, ...productsArray]);
        } else {
            setProducts(productsArray);
        }
    };
    // 필터나 정렬이 바뀔 때 실행되는 useEffect (이 훅은 항상 1페이지부터 데이터를 새로 불러옴)
    useEffect(() => {
        setPage(1); // 페이지 번호를 1로 리셋
        setHasMore(true); // '더 보기' 버튼이 다시 보이도록 리셋
        fetchProducts(1, false); // 1페이지 데이터를 새로(append: false) 불러옴
    }, [filters, sortOrder]);

    // 페이지 번호가 바뀔 때(더 보기 클릭) 실행되는 useEffect (이 훅은 1페이지 이후의 데이터를 불러와서 기존 목록에 추가)
    useEffect(() => {
        if (page > 1) {
            fetchProducts(page, true); // 현재 페이지(2, 3, ...) 데이터를 추가(append: true)
        }
    }, [page]);

    const loadData = () => {
        const morePage = page + 1;
        setPage(morePage);
    }

    return (
        <div className="flex px-8 py-6 gap-10 min-h-screen">

            <SidebarFilters filters={filters} setFilters={setFilters} sortOrder={sortOrder} />

            <main className="flex-1">
                <SortMenu sortOrder={sortOrder} setSortOrder={setSortOrder} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                                gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-16
                                gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-y-12 xl:gap-y-20
                                w-full mt-16 px-4">
                    {Array.isArray(products) && products.map(product => (
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
