import SidebarFilters from "./SidebarFilter"
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';

import TailButton from "../UI/TailButton";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// ✅ 1. 설정된 axios 인스턴스(api)를 import 합니다.
import api from '../api/axios';

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
                
                // ✅ 2. fetch 대신 'api.get'을 사용합니다.
                // 토큰은 인터셉터가 자동으로 추가해주므로 헤더 설정이 필요 없습니다.
                // params 객체를 사용하면 axios가 자동으로 쿼리 스트링을 만들어줍니다.
                const res = await api.get('/api/public/search', {
                    params: queryParams
                });

                // ✅ 3. axios는 응답 데이터를 res.data에 담아줍니다.
                const data = res.data || [];

                if (page === 1) {
                    setDisplayedProducts(data);
                } else {
                    setDisplayedProducts(prev => [...prev, ...data]);
                }

                setHasMore(data.length === PRODUCTS_PER_PAGE);

            } catch (error) {
                console.error("Failed to fetch products:", error.response?.data || error.message);
                setHasMore(false);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [page, location.search, keyword]); // keyword 의존성은 유지하는 것이 좋습니다.

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
                            '{keyword}' 검색 결과 <span className="text-kalani-gold">{filteredProducts.length}</span>개
                        </h2>
                    ) : (
                        // 검색 결과가 없을 때도 공간을 차지하도록 invisible 처리
                        <h2 className="text-xl font-semibold invisible">Placeholder</h2>
                    )}
                    {filteredProducts.length > 0 && <SortMenu sortOrder={sortOrder} onSortChange={handleSortChange} />}
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