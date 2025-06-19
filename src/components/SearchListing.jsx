import SidebarFilters from "./SidebarFilter"
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';

import TailButton from "../UI/TailButton";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function SearchListing() {
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();

    const PRODUCTS_PER_PAGE = 20;

    const currentParams = new URLSearchParams(location.search);
    const keyword = currentParams.get('keyword') || '';
    const filters = {
        size: currentParams.getAll('size'),
        gender: currentParams.getAll('gender'),
        print: currentParams.getAll('print'),
        color: currentParams.getAll('color'),
        mid: currentParams.getAll('mid'),
        sub: currentParams.getAll('sub'),
        main: currentParams.get('main') || '',
        minPrice: currentParams.get('minPrice') ? parseInt(currentParams.get('minPrice'), 10) : MIN_PRICE,
        maxPrice: currentParams.get('maxPrice') ? parseInt(currentParams.get('maxPrice'), 10) : MAX_PRICE,
    };
    const initialSort = currentParams.get('sort') || 'newest';
    const [sortOrder, setSortOrder] = useState(initialSort);

    // 검색어, 필터, 정렬이 바뀌면 페이지 초기화 + 상품 초기화 + hasMore 초기화
    useEffect(() => {
        setPage(1);
        setDisplayedProducts([]);
        setHasMore(true);
    }, [location.search]);

    // 페이지 또는 필터 변경 시 상품 불러오기
    useEffect(() => {
        // 키워드가 없으면 초기화하고 API 호출을 중단합니다.
        if (!keyword) {
            setIsLoading(false);
            setDisplayedProducts([]);
            setHasMore(false);
            return;
        }

        const fetchProducts = async () => {
            setIsLoading(true);

            try {
                // 1. 요청 헤더 준비
                const headers = new Headers();
                headers.append("Content-Type", "application/json"); // 보내는 데이터 타입 명시 (필수는 아니지만 좋은 습관)

                // 2. localStorage에서 토큰 가져오기
                const token = localStorage.getItem('accessToken');

                // 3. 토큰이 존재하면 Authorization 헤더에 추가
                if (token) {
                    headers.append("Authorization", `Bearer ${token}`);
                }

                // 4. 요청 URL 및 쿼리 파라미터 준비
                const queryParams = new URLSearchParams(location.search);
                queryParams.set('page', page);
                queryParams.set('limit', PRODUCTS_PER_PAGE);

                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const url = `http://${baseUrl}/api/public/search?${queryParams.toString()}`;

                // 5. fetch 요청 시 headers를 포함한 옵션 객체 전달
                const res = await fetch(url, {
                    method: 'GET', // GET 요청은 기본값이지만 명시적으로 작성
                    headers: headers // 준비된 헤더를 여기에 추가
                });

                // --- 여기부터는 기존 코드와 동일 ---

                if (!res.ok) { // 200번대 응답이 아닌 경우 에러 처리
                    throw new Error(`API responded with status ${res.status}`);
                }

                const data = await res.json();

                // 페이지에 따라 상품 목록을 설정하거나 추가합니다.
                if (page === 1) {
                    setDisplayedProducts(data);
                } else {
                    setDisplayedProducts(prev => [...prev, ...data]);
                }

                // 더 불러올 데이터가 있는지 확인합니다.
                setHasMore(data.length === PRODUCTS_PER_PAGE);

                if (page === 1 && data.length === 0) {
                    setHasMore(false);
                }
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [page, location.search, keyword]);

    const handleFilterChange = (changedFilter) => {
        const currentParams = new URLSearchParams(location.search);

        Object.entries(changedFilter).forEach(([key, value]) => {
            currentParams.delete(key);

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

        if (changedFilter.main !== undefined) {
            currentParams.delete('mid');
            currentParams.delete('sub');
        }
        if (changedFilter.mid !== undefined) {
            currentParams.delete('sub');
        }

        currentParams.set('page', '1');
        navigate(`/search?${currentParams.toString()}`);
    };

    const handleSortChange = (newSort) => {
        setSortOrder(newSort);
        const currentParams = new URLSearchParams(location.search);
        currentParams.set('sort', newSort);
        currentParams.set('page', '1');
        navigate(`/search?${currentParams.toString()}`);
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    const filteredProducts = displayedProducts.filter(product => {
        if (filters.gender.length > 0) {
            return product.main !== 'kids';
        }
        return true;
    });

    return (
        <div className="flex px-8 py-6 gap-10 min-h-screen">
            {keyword && <SidebarFilters filters={filters} onFilterChange={handleFilterChange} keyword={keyword} />}
            <main className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    {displayedProducts.length > 0 ? (
                        <h2 className="text-xl font-semibold">
                            '{keyword}' 검색 결과 <span className="text-kalani-gold">{displayedProducts.length}</span>개
                        </h2>
                    ) : (
                        <h2 className="text-xl font-semibold invisible">Placeholder</h2>
                    )}
                    {displayedProducts.length > 0 && <SortMenu sortOrder={sortOrder} onSortChange={handleSortChange} />}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
                                gap-x-6 sm:gap-x-8 
                                gap-y-10 sm:gap-y-12">
                    {isLoading && displayedProducts.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 font-medium">
                            검색 중입니다...
                        </div>
                    )}
                    {!isLoading && keyword && filteredProducts.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 font-medium">
                            '{keyword}'에 대한 검색 결과가 없습니다.
                        </div>
                    )}

                    {filteredProducts.map(product => (
                        <ProductCard key={product.imgname || product.fullcode} product={product} />
                    ))}
                </div>

                {hasMore && !isLoading && (
                    <div className="text-center mt-12">
                        <TailButton onClick={loadMore} size="md">더 보기</TailButton>
                    </div>
                )}

                {isLoading && displayedProducts.length > 0 && (
                    <div className="text-center mt-12 text-gray-500 font-semibold animate-pulse">
                        상품을 더 가져오고 있습니다...
                    </div>
                )}
            </main>
        </div>
    );
}
