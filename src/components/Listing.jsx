import SidebarFilters from "./SidebarFilter";
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';
import { useEffect, useState, } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function Listing() {
    const [allProducts, setAllProducts] = useState([]); // 백엔드에서 받은 전체 상품
    const [displayedProducts, setDisplayedProducts] = useState([]); // 화면에 보여줄 상품
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const PRODUCTS_PER_PAGE = 20;

    // [핵심 수정 1] URL이 변경될 때만 데이터를 가져오는 단일 useEffect
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setAllProducts([]); // 새로운 필터링 시 기존 데이터 초기화
            setDisplayedProducts([]);
            setPage(1);

            // API 요청을 위한 파라미터 준비
            const queryParams = new URLSearchParams(location.search);
            queryParams.delete('page');
            queryParams.delete('limit');

            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await fetch(`http://${baseUrl}/api/public/category/goods?${queryParams.toString()}`);
                const data = await res.json();
                setAllProducts(data || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setAllProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    // 보여줄 상품을 업데이트하는 useEffect
    useEffect(() => {
        // 전체 상품 목록에서 현재 페이지에 해당하는 부분만 잘라냅니다.
        const newDisplayedProducts = allProducts.slice(0, page * PRODUCTS_PER_PAGE);
        setDisplayedProducts(newDisplayedProducts);
    }, [allProducts, page]);


    const currentParams = new URLSearchParams(location.search);
    const filters = {
        gender: currentParams.getAll('gender'),
        print: currentParams.getAll('print'),
        color: currentParams.getAll('color'),
        mid: currentParams.getAll('mid'),
        sub: currentParams.getAll('sub'),
        main: currentParams.get('main') || '',
        minPrice: currentParams.get('minPrice') ? parseInt(currentParams.get('minPrice'), 10) : MIN_PRICE,
        maxPrice: currentParams.get('maxPrice') ? parseInt(currentParams.get('maxPrice'), 10) : MAX_PRICE,
    };
    const sortOrder = currentParams.get('sort') || 'newest';
    const hasMore = displayedProducts.length < allProducts.length;

    // 핸들러 함수들
    const handleFilterChange = (changedParams) => {
        const currentParams = new URLSearchParams(location.search);

        Object.entries(changedParams).forEach(([key, value]) => {
            currentParams.delete(key);

            // 수정된 조건: 숫자 0도 통과시키도록 체크
            const isValidValue =
                Array.isArray(value) ? value.length > 0 :
                    value !== undefined && value !== null && value !== '';

            if (isValidValue) {
                if (Array.isArray(value)) {
                    value.forEach(v => currentParams.append(key, v));
                } else {
                    currentParams.set(key, value.toString());
                }
            }
        });

        currentParams.set('page', '1');
        navigate(`${location.pathname}?${currentParams.toString()}`);
    };

    const handleSortChange = (newSort) => {
        const currentParams = new URLSearchParams(location.search);
        currentParams.set('sort', newSort.sort);
        currentParams.set('page', '1');
        navigate(`${location.pathname}?${currentParams.toString()}`);
    };

    // '더 보기' 버튼 클릭 핸들러
    const loadMore = () => {
        // 단순히 페이지 번호만 1 증가시킵니다.
        setPage(prevPage => prevPage + 1);
    };

    return (
        <div className="flex px-8 py-6 gap-10 min-h-screen">
            <SidebarFilters filters={filters} onFilterChange={handleFilterChange} />
            <main className="flex-1">
                <SortMenu sortOrder={sortOrder} onSortChange={handleSortChange} />

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                                gap-x-6 sm:gap-x-8 
                                gap-y-10 sm:gap-y-12">
                    {/* 로딩 및 결과 없음 UI */}
                    {isLoading && displayedProducts.length === 0 && <div className="col-span-full ...">로딩 중...</div>}
                    {!isLoading && displayedProducts.length === 0 && <div className="col-span-full ...">상품이 없습니다.</div>}

                    {displayedProducts.map(product => (
                        <ProductCard key={product.imgname || product.fullcode} product={product} />
                    ))}
                </div>

                {hasMore && !isLoading && (
                    <div className="text-center mt-12">
                        <button onClick={loadMore} className="px-8 py-3 bg-kalani-navy text-white font-bold rounded shadow-md hover:opacity-80 transition-opacity disabled:bg-gray-400 disabled:cursor-not-allowed">
                            더 보기
                        </button>
                    </div>
                )}
                {isLoading && displayedProducts.length > 0 && <div className="text-center mt-12 text-gray-500 font-semibold animate-pulse">로딩 중...</div>}
            </main>
        </div>
    );
}