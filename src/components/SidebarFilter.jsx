// 가격 슬라이더
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// 훅 목록
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// component 목록
import Breadcrumb from './Breadcrumb';

// UI 목록
import ColorSwatch from '../UI/ColorSwatch';

import colorMap from '../local/colorMap';
import colorOptions from '../local/colorOptions';
import categoryTree from '../local/categoryTree';
import categoryKR from '../local/categoryKR';

// 성별
const genderOptions = ['f', 'm', 'u'];
// 무늬
const patternOptions = ["graphic", "striped", "solid", "checkered", "dott", "pattern"];
// 대분류
const mainCategories = ['top', 'bottom', 'underwear', 'acc', 'kids', 'swimwear', 'skirts_dress'];

// 가격 최대와 최소
const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function SidebarFilters({ filters, setFilters, keyword, sortOrder }) {
    const navigate = useNavigate();
    const location = useLocation();
    const isInitail = useRef(true);
    const [localPrice, setLocalPrice] = useState([
        filters.minPrice || MIN_PRICE,
        filters.maxPrice || MAX_PRICE
    ]);

    // [추가] 외부 filters 상태(예: URL 파싱 결과)가 바뀌면 로컬 슬라이더 상태도 동기화함
    useEffect(() => {
        setLocalPrice([
            filters.minPrice || MIN_PRICE,
            filters.maxPrice || MAX_PRICE
        ]);
    }, [filters.minPrice, filters.maxPrice]);

    const safeArray = (arr) => Array.isArray(arr) ? arr : arr ? [arr] : [];

    // 이 useEffect는 상태(filters)가 바뀔 때마다 URL을 업데이트 (State -> URL)
    useEffect(() => {
        if (isInitail.current) {
            isInitail.current = false;
            return;
        }

        const searchParams = new URLSearchParams();
        if (keyword) {
            searchParams.set('keyword', keyword);
        }
        if (sortOrder) {
            searchParams.set('sort', sortOrder);
        }
        Object.entries(filters).forEach(([key, value]) => {
            // 1. 가격 필터 처리: 기본값이 아니고, 유효한 값일 때만 추가
            if (key === 'minPrice' && value !== null && value !== undefined && value !== MIN_PRICE) {
                searchParams.set(key, value);
            }
            else if (key === 'maxPrice' && value !== null && value !== undefined && value !== MAX_PRICE) {
                searchParams.set(key, value);
            }
            // 2. 대분류(main) 필터 처리: 빈 문자열이 아닐 때만 추가
            else if (key === 'main' && value) {
                searchParams.set(key, value);
            }
            // 3. 나머지 배열 필터 처리: 배열이 비어있지 않을 때만 추가
            else if (Array.isArray(value) && value.length > 0) {
                value.forEach(v => searchParams.append(key, v));
            }
        });

        const newSearch = searchParams.toString();
        const newPath = `${location.pathname}${newSearch ? '?' : ''}${newSearch}`;
        const currentPath = location.pathname + location.search;

        if (currentPath !== newPath) {
            navigate(newPath, { replace: true });
        }
    }, [filters, location.pathname, navigate, keyword, sortOrder]);

    const handlePriceChange = (value) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            minPrice: value[0],
            maxPrice: value[1],
        }));
    };

    const handleCheckbox = (category, option) => {
        const current = safeArray(filters[category]);
        const updated = current.includes(option)
            ? current.filter((item) => item !== option)
            : [...current, option];

        setFilters({
            ...filters,
            [category]: updated,
        });
    };

    const handleRadio = (category, value) => {
        if (filters[category] === value) return;

        if (category === 'main') {
            const newMids = Object.keys(categoryTree[value] || {});
            const filteredMids = safeArray(filters.mid).filter((mid) => newMids.includes(mid));

            setFilters({
                ...filters,
                main: value,
                mid: filteredMids,
                sub: [],
            });
        } else {
            setFilters({
                ...filters,
                [category]: value,
            });
        }
    };

    const selectedMain = filters.main;
    const mids = selectedMain ? Object.keys(categoryTree[selectedMain] || {}) : [];
    const subs = selectedMain && filters.mid
        ? filters.mid.flatMap((mid) => categoryTree[selectedMain]?.[mid] || [])
        : [];

    const filteredGenderOptions = selectedMain === 'skirts_dress' ? ['f'] : genderOptions;

    const renderCheckboxGroup = (title, category, options) => {
        const selectedValues = safeArray(filters[category]);

        return (
            <div className="mb-4">
                <h3 className="font-semibold mb-4">{title}</h3>
                {category === "color" ? (
                    <div className="grid grid-cols-6 place-items-center gap-1">
                        {options.map((option) => {
                            const isChecked = selectedValues.includes(option);
                            return (
                                <label key={option} className="cursor-pointer w-8 h-8 flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => handleCheckbox(category, option)}
                                        className="form-checkbox hidden"
                                    />
                                    <ColorSwatch colorCode={colorMap[option]} label={option} selected={isChecked} />
                                </label>
                            );
                        })}
                    </div>
                ) : (
                    options.map((option) => {
                        const isChecked = selectedValues.includes(option);
                        return (
                            <label key={option} className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => handleCheckbox(category, option)}
                                    className="form-checkbox"
                                />
                                <span className={`transition-colors ${isChecked ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                                    {categoryKR[option] || option}
                                </span>
                            </label>
                        );
                    })
                )}
            </div>
        );
    };

    return (
        <div className="w-96 h-[calc(100vh-4rem)] overflow-y-auto bg-white p-4 sticky top-16" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Breadcrumb filters={filters} keyword={keyword} />

            <div className="mb-4">
                <h3 className="font-semibold mb-4">대분류</h3>
                <div className="space-y-1">
                    {mainCategories.map((main) => (
                        <div
                            key={main}
                            onClick={() => handleRadio('main', main)}
                            className={`cursor-pointer px-1 py-0.5 ${filters.main === main ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}
                        >
                            {categoryKR[main] || main}
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-t border-gray-300 my-6" />
            {mids.length > 0 && (
                <>
                    {renderCheckboxGroup("중분류", "mid", mids)}
                    <hr className="border-t border-gray-300 my-6" />
                </>)}
            {subs.length > 0 && (
                <>
                    {renderCheckboxGroup("소분류", "sub", [...new Set(subs)])}
                    <hr className="border-t border-gray-300 my-6" />
                </>)}
            {renderCheckboxGroup("성별", "gender", filteredGenderOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("색상", "color", colorOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("무늬", "print", patternOptions)}
            <hr className="border-t border-gray-300 my-6" />
            <div className="mb-4 px-1">
                <h3 className="font-semibold mb-4">가격</h3>
                <Slider
                    range // 두 개의 핸들을 가진 범위 슬라이더로 설정
                    min={MIN_PRICE} // 슬라이더의 전체 최소값
                    max={MAX_PRICE} // 슬라이더의 전체 최대값
                    step={1000} // 1000원 단위로 움직이도록 설정
                    value={localPrice} // 슬라이더의 현재 값 (로컬 상태와 연결)
                    onChange={setLocalPrice} // 드래그하는 동안 로컬 상태만 업데이트 (UI 즉시 반영)
                    onChangeComplete={handlePriceChange} // 드래그가 끝났을 때만 부모 상태 업데이트
                    styles={{
                        track: { backgroundColor: 'black' },
                        handle: {
                            borderColor: 'black',
                            borderWidth: 2,
                            backgroundColor: 'white',
                            opacity: 1 // 핸들이 항상 보이도록 설정
                        },
                        rail: { backgroundColor: '#E5E7EB' }
                    }} // 전체 트랙 스타일
                />
                <div className="flex justify-between mt-2 text-sm text-gray-600">
                    <span>{localPrice[0].toLocaleString()}</span>
                    <span>{localPrice[1].toLocaleString()}</span>
                </div>
            </div>
        </div>
    );
}
