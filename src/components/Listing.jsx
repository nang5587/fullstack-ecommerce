import SidebarFilters from "./SidebarFilter";
import ProductCard from "./ProductCard";
import SortMenu from './SortMenu';
import TailButton from "../UI/TailButton";

import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import qs from 'qs';

import api from '../api/axios';

const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function Listing() {
    const [allProducts, setAllProducts] = useState([]);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [wishMap, setWishMap] = useState({});
    const { isLoggedIn } = useAuth();

    const location = useLocation();
    const navigate = useNavigate();
    const PRODUCTS_PER_PAGE = 20;

    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);
            setAllProducts([]);
            setDisplayedProducts([]);
            setWishMap({});
            setPage(1);

            const queryParams = new URLSearchParams(location.search);
            queryParams.delete('page');
            queryParams.delete('limit');

            try {
                const res = await api.get('/api/public/category/goods', { params: queryParams });
                setAllProducts(res.data || []);
            } catch (error) {
                console.error("Failed to fetch products:", error);
                setAllProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, [location.search]);

    useEffect(() => {
        const newDisplayed = allProducts.slice(0, page * PRODUCTS_PER_PAGE);
        setDisplayedProducts(newDisplayed);
    }, [allProducts, page]);

    // 💡 하트 정보 조회
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

    const currentParams = new URLSearchParams(location.search);
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
    const hasMore = displayedProducts.length < allProducts.length;

    const handleFilterChange = (changedParams) => {
        const currentParams = new URLSearchParams(location.search);

        Object.entries(changedParams).forEach(([key, value]) => {
            currentParams.delete(key);
            const isValid = Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null && value !== '';
            if (isValid) {
                if (Array.isArray(value)) {
                    value.forEach(v => currentParams.append(key, v));
                } else {
                    currentParams.set(key, value.toString());
                }
            }
        });

        if (changedParams.main === 'kids') currentParams.delete('gender');
        if (changedParams.gender && changedParams.gender.length > 0) {
            const main = currentParams.get('main');
            if (main === 'kids') currentParams.delete('main');
        }

        currentParams.set('page', '1');
        navigate(`${location.pathname}?${currentParams.toString()}`);
    };

    const handleSortChange = (newSort) => {
        setSortOrder(newSort);
        const currentParams = new URLSearchParams(location.search);
        currentParams.set('sort', newSort);
        currentParams.set('page', '1');
        navigate(`${location.pathname}?${currentParams.toString()}`);
    };

    const loadMore = () => {
        setPage(prevPage => prevPage + 1);
    };

    const filteredProducts = displayedProducts.filter(product => {
        if (filters.gender.length > 0) {
            return product.main !== 'kids';
        }
        return true;
    });

    return (
        <div className="flex px-8 py-6 gap-10 min-h-screen">
            <SidebarFilters filters={filters} onFilterChange={handleFilterChange} />
            <main className="flex-1">
                <SortMenu sortOrder={sortOrder} onSortChange={handleSortChange} />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 sm:gap-x-8 gap-y-10 sm:gap-y-12">
                    {isLoading && displayedProducts.length === 0 && <div className="col-span-full">로딩 중...</div>}
                    {!isLoading && filteredProducts.length === 0 && <div className="col-span-full">상품이 없습니다.</div>}

                    {filteredProducts.map(product => (
                        <ProductCard
                            key={product.imgname || product.fullcode}
                            product={product}
                            liked={wishMap[product.imgname] || false}
                        />
                    ))}
                </div>

                {hasMore && !isLoading && (
                    <div className="text-center mt-12">
                        <TailButton onClick={loadMore} size="md">더 보기</TailButton>
                    </div>
                )}
                {isLoading && displayedProducts.length > 0 && (
                    <div className="text-center mt-12 text-gray-500 font-semibold animate-pulse">로딩 중...</div>
                )}
            </main>
        </div>
    );
}
