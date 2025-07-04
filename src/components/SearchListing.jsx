import SidebarFilters from "./SidebarFilter";
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';
import TailButton from "../UI/TailButton";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import qs from 'qs';


// ✅ axios 인스턴스(api)
import api from '../api/axios';

const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function SearchListing() {
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const { isLoggedIn } = useAuth();

    // 🔥 wishMap: { imgname: true/false }
    const [wishMap, setWishMap] = useState({});

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

    // 1. 검색어/필터/정렬 바뀌면 페이지 초기화
    useEffect(() => {
        setPage(1);
        setDisplayedProducts([]);
        setHasMore(true);
    }, [location.search]);

    // 2. 상품 조회
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

                // 상품 데이터 요청
                const res = await api.get('/api/public/search', {
                    params: queryParams
                });
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
    }, [page, location.search]);

    // 3. wishMap 요청 (상품이 바뀔 때마다, 상품이 있으면)
    useEffect(() => {
        if (!isLoggedIn || displayedProducts.length === 0) {
            setWishMap({});
            return;
        }

        const imgnames = displayedProducts.map(p => p.imgname).filter(Boolean);
        if (imgnames.length === 0) return;

        api.get('/api/member/heartOnList', {
            params: { imgnames },
            paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' }),
        })
            .then(res => setWishMap(res.data))
            .catch(() => setWishMap({}));
    }, [displayedProducts, isLoggedIn]);

    // 필터 & 정렬 변경
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

    // gender 예외처리(예시)
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
                        <ProductCard
                            key={product.imgname || product.fullcode}
                            product={product}
                            liked={wishMap[product.imgname] || false}  // 각 상품에 하트 상태 전달
                        />
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
