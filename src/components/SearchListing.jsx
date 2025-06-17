import SidebarFilters from "./SidebarFilter"
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';

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

    // 검색어, 필터, 정렬이 바뀌면 페이지 초기화 + 상품 초기화 + hasMore 초기화
    useEffect(() => {
        setPage(1);
        setDisplayedProducts([]);
        setHasMore(true);
    }, [location.search]);

    // 페이지 또는 필터 변경 시 상품 불러오기
    useEffect(() => {
        // keyword 없으면 fetch 하지 말자
        if (!keyword) {
            setIsLoading(false);
            setDisplayedProducts([]);
            setHasMore(false);
            return;
        }

        const fetchProducts = async () => {
            setIsLoading(true);

            try {
                const queryParams = new URLSearchParams(location.search);
                queryParams.set('page', page);
                queryParams.set('limit', PRODUCTS_PER_PAGE);

                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await fetch(`http://${baseUrl}/api/public/search?${queryParams.toString()}`);
                const data = await res.json();

                if (page === 1) {
                    setDisplayedProducts(data);
                } else {
                    setDisplayedProducts(prev => [...prev, ...data]);
                }

                // 데이터 길이가 페이지당 상품 수보다 작으면 더이상 불러올게 없음
                setHasMore(data.length === PRODUCTS_PER_PAGE);

                // 만약 첫 페이지인데 상품이 하나도 없으면 hasMore도 false로
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
        const currentParams = new URLSearchParams(location.search);
        currentParams.set('sort', newSort.sort);
        currentParams.set('page', '1');
        navigate(`/search?${currentParams.toString()}`);
    };

    const loadMore = () => {
        if (!isLoading && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className="flex px-8 py-6 gap-10 min-h-screen">
            {keyword && <SidebarFilters filters={filters} onFilterChange={handleFilterChange} />}
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
                    {!isLoading && keyword && displayedProducts.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500 font-medium">
                            '{keyword}'에 대한 검색 결과가 없습니다.
                        </div>
                    )}

                    {displayedProducts.map(product => (
                        <ProductCard key={product.imgname || product.fullcode} product={product} />
                    ))}
                </div>

                {hasMore && !isLoading && (
                    <div className="text-center mt-12">
                        <button
                            onClick={loadMore}
                            className="px-8 py-3 bg-kalani-navy text-white font-semibold rounded-md shadow-md hover:opacity-90 transition-opacity disabled:bg-gray-400"
                        >
                            더 보기
                        </button>
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
