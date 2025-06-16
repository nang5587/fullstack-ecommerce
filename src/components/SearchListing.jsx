// component 목록
import SidebarFilters from "./SidebarFilter"
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';

// 훅 목록
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

// 가격 최대와 최소
const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function SearchListing() {
    const [sortOrder, setSortOrder] = useState('newest');
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [keyword, setKeyword] = useState(''); // [추가] 검색어 상태
    const [filters, setFilters] = useState({
        gender: [],
        pattern: [],
        color: [],
        mid: [],
        sub: [],
        main: '',
        minPrice: MIN_PRICE,
        maxPrice: MAX_PRICE,
    });
    const location = useLocation();

    // 이 useEffect는 Listing.jsx와 거의 동일합니다.
    // URL이 바뀔 때마다 keyword와 filters를 상태에 설정합니다.
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const sortFromUrl = params.get('sort');
        if (sortFromUrl) {
            setSortOrder(sortFromUrl);
        }
        // [추가] URL에서 keyword를 추출합니다.
        setKeyword(params.get('keyword') || '');

        // 이하 로직은 Listing.jsx와 완전히 동일합니다.
        const newFilters = {};
        for (const [key, value] of params.entries()) {
            if (key === 'keyword') continue; // keyword는 별도로 처리하므로 건너뜁니다.
            if (newFilters[key]) {
                newFilters[key] = Array.isArray(newFilters[key])
                    ? [...newFilters[key], value]
                    : [newFilters[key], value];
            } else {
                newFilters[key] = value;
            }
        }

        const safeArray = (arr) => Array.isArray(arr) ? arr : arr ? [arr] : [];

        const normalized = {
            gender: safeArray(newFilters.gender),
            print: safeArray(newFilters.print),
            color: safeArray(newFilters.color),
            mid: safeArray(newFilters.mid),
            sub: safeArray(newFilters.sub),
            main: newFilters.main || '',
            minPrice: newFilters.minPrice ? parseInt(newFilters.minPrice, 10) : MIN_PRICE,
            maxPrice: newFilters.maxPrice ? parseInt(newFilters.maxPrice, 10) : MAX_PRICE,
        };

        // [수정] 상태 업데이트는 실제로 변경되었을 때만 수행하도록 변경 (무한 루프 방지)
        if (JSON.stringify(normalized) !== JSON.stringify(filters)) {
            setFilters(normalized);
        }
        setPage(1); // URL이 바뀌면 항상 1페이지부터 시작
    }, [location.search]);


    const fetchProducts = async (pageToFetch, shouldAppend) => {
        // [수정] API 요청에 keyword를 추가해야 합니다.
        if (!keyword) return; // 검색어가 없으면 요청하지 않음

        const params = new URLSearchParams({
            keyword: keyword, // [추가] 검색어 파라미터
            page: pageToFetch,
            limit: 20,
            sort: sortOrder,
        });

        // 이하 필터 파라미터 추가 로직은 Listing.jsx와 동일합니다.
        Object.entries(filters).forEach(([key, value]) => {
            if (value === null || value === undefined) return;
            if (key === 'main' && value) {
                params.set(key, value);
            } else if ((key === 'minPrice' && value !== MIN_PRICE) || (key === 'maxPrice' && value !== MAX_PRICE)) {
                params.set(key, value);
            } else if (Array.isArray(value) && value.length > 0) {
                value.forEach((v) => params.append(key, v));
            }
        });

        const baseUrl = import.meta.env.VITE_BACKEND_URL;
        const res = await fetch(`http://${baseUrl}/api/public/search?${params.toString()}`);
        const data = await res.json();

        // 이하 로직은 Listing.jsx와 동일
        const productsArray = data.searchResults || [];

        setHasMore(productsArray.length === 20);

        if (shouldAppend) {
            setProducts(prevProducts => [...prevProducts, ...productsArray]);
        } else {
            setProducts(productsArray);
        }
    };

    // 이 useEffect도 Listing.jsx와 동일합니다.
    useEffect(() => {
        if (keyword) {
            setPage(1); // 페이지 번호를 1로 리셋
            setHasMore(true); // '더 보기' 버튼이 다시 보이도록 리셋
            fetchProducts(1, false); // 1페이지 데이터를 새로(append: false) 불러옴
        } else {
            setProducts([]); // keyword가 없으면 목록을 비움
        }
    }, [filters, keyword, sortOrder]); // [수정] keyword가 바뀔 때도 상품을 다시 불러와야 함

    useEffect(() => {
        if (page > 1) {
            fetchProducts(page, true); // 현재 페이지(2, 3, ...) 데이터를 추가(append: true)
        }
    }, [page]);

    const loadData = () => {
        const morePage = page + 1;
        setPage(morePage);
    }
    // loadData, return 문은 Listing.jsx와 완전히 동일합니다.
    return (
        <div className="flex px-8 py-6 gap-10 min-h-screen">
            <SidebarFilters filters={filters} setFilters={setFilters} keyword={keyword} sortOrder={sortOrder} />
            <main className="flex-1">
                {products.length > 0 && <SortMenu sortOrder={sortOrder} setSortOrder={setSortOrder} />}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 
                                                gap-x-4 sm:gap-x-6 md:gap-x-8 lg:gap-x-10 xl:gap-x-16
                                                gap-y-6 sm:gap-y-8 md:gap-y-10 lg:gap-y-12 xl:gap-y-20
                                                w-full mt-16 px-4">
                    {Array.isArray(products) && products.length > 0 ? (
                        products.map(product => (
                            <ProductCard key={product.imgname} product={product} />
                        ))

                    ) : (
                        // [추가] 검색 결과가 없을 때 메시지 표시
                        !keyword ? null : <p className="p-4 text-base font-bold">검색 결과가 없습니다.</p>
                    )}
                </div>
                {hasMore && keyword && products.length > 0 && (
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
    );
}