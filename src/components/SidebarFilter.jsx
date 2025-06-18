// 가격 슬라이더
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

// Icon
import { RefreshCcw } from 'lucide-react';

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
// 사이즈
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL'];
// 무늬
const patternOptions = ["graphic", "striped", "solid", "checkered", "dott", "pattern"];
// 대분류
const mainCategories = ['top', 'bottom', 'underwear', 'acc', 'kids', 'swimwear', 'skirts_dress'];

// 가격 최대와 최소
const MIN_PRICE = 0;
const MAX_PRICE = 50000;

export default function SidebarFilters({ filters, onFilterChange, keyword }) {
    const [localPrice, setLocalPrice] = useState([filters.minPrice, filters.maxPrice]);

    // [추가] 외부 filters 상태(예: URL 파싱 결과)가 바뀌면 로컬 슬라이더 상태도 동기화함
    useEffect(() => {
        setLocalPrice([
            filters.minPrice,
            filters.maxPrice
        ]);
    }, [filters.minPrice, filters.maxPrice]);

    // 체크박스 변경 관리
    const handleCheckbox = (category, option) => {
        const current = Array.isArray(filters[category]) ? filters[category] : [];
        const updated = current.includes(option)
            ? current.filter((item) => item !== option)
            : [...current, option];

        const newFilter = { [category]: updated };

        // [수정] 만약 변경된 카테고리가 '중분류(mid)'라면, '소분류(sub)'를 초기화합니다.
        if (category === 'mid') {
            newFilter.sub = []; // 소분류 선택을 빈 배열로 초기화
        }

        onFilterChange(newFilter);
    };

    // 대분류 변경 처리
    const handleMainCategory = (main) => {
        const newMain = filters.main === main ? '' : main;
        // [핵심 2] 대분류를 바꾸면, 중분류와 소분류를 초기화하라는 정보를 함께 보냅니다.
        onFilterChange({ main: newMain, mid: [], sub: [] });
    };

    // 가격 슬라이더 변경 처리
    const handlePriceChangeComplete = (value) => {
        // [핵심 3] 가격 변경 시, minPrice와 maxPrice를 한 객체에 담아 보냅니다.
        onFilterChange({ minPrice: value[0], maxPrice: value[1] });
    };

    const selectedMain = filters.main;
    const mids = selectedMain ? Object.keys(categoryTree[selectedMain] || {}) : [];
    const subs = selectedMain && Array.isArray(filters.mid)
        ? filters.mid.flatMap((mid) => categoryTree[selectedMain]?.[mid] || [])
        : [];
    // const filteredGenderOptions = selectedMain === 'skirts_dress' ? ['f'] : genderOptions;
    const isSwimwearFemaleOnly =
        selectedMain === 'swimwear' &&
        filters.mid?.some(mid => ['bikini', 'onepiece'].includes(mid));

    const isBra =
        selectedMain === 'underwear' &&
        filters.mid?.includes('top') &&
        filters.sub?.includes('bra');

    const filteredGenderOptions =
        selectedMain !== 'kids'
            ? (isSwimwearFemaleOnly || isBra
                ? ['f']  // 여성만
                : (selectedMain === 'skirts_dress' ? ['f'] : genderOptions))
            : [];

    const renderCheckboxGroup = (title, category, options) => {
        const selectedValues = Array.isArray(filters[category]) ? filters[category] : [];

        return (
            <div className="mb-4">
                <h3 className="font-semibold mb-4 text-kalani-navy">{title}</h3>
                {category === "color" ? (
                    <div className="grid grid-cols-6 place-items-center gap-1">
                        {options.map((option) => (
                            <label key={option} className="cursor-pointer w-8 h-8 flex items-center justify-center">
                                <input
                                    type="checkbox"
                                    checked={selectedValues.includes(option)}
                                    onChange={() => handleCheckbox(category, option)}
                                    className="form-checkbox hidden"
                                />
                                <ColorSwatch colorCode={colorMap[option]} label={option} selected={selectedValues.includes(option)} />
                            </label>
                        ))}
                    </div>
                ) : (
                    options.map((option) => (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option)}
                                onChange={() => handleCheckbox(category, option)}
                                className="form-checkbox"
                            />
                            <span className={`transition-colors ${selectedValues.includes(option) ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                                {categoryKR[option] || option}
                            </span>
                        </label>
                    ))
                )}
            </div>
        );
    };

    const handleResetFilters = () => {
        onFilterChange({
            main: '',
            mid: [],
            sub: [],
            gender: [],
            size: [],
            color: [],
            print: [],
            minPrice: MIN_PRICE,
            maxPrice: MAX_PRICE,
        });
    };

    return (
        <div className="w-96 h-[calc(100vh-4rem)] overflow-y-auto bg-white p-4 sticky top-16" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            <Breadcrumb filters={filters} keyword={keyword} />
            <div className="flex justify-end mb-4">
                <button
                    onClick={handleResetFilters}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-kalani-navy transition-all"
                    title="필터 초기화"
                >
                    <RefreshCcw size={18} strokeWidth={1.5} />
                    초기화
                </button>
            </div>

            {!keyword && (
                <div className="mb-4">
                    <h3 className="font-semibold mb-4 text-kalani-navy">대분류</h3>
                    <div className="space-y-1">
                        {mainCategories.map((main) => (
                            <div
                                key={main}
                                onClick={() => handleMainCategory(main)}
                                className={`cursor-pointer px-1 py-0.5 ${filters.main === main ? 'text-gray-700 font-semibold' : 'text-gray-400'}`}
                            >
                                {categoryKR[main] || main}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {!keyword && mids.length > 0 && (
                <>
                    {renderCheckboxGroup("중분류", "mid", mids)}
                    <hr className="border-t border-gray-300 my-6" />
                </>
            )}

            {!keyword && subs.length > 0 && (
                <>
                    {renderCheckboxGroup("소분류", "sub", [...new Set(subs)])}
                    <hr className="border-t border-gray-300 my-6" />
                </>
            )}
            {renderCheckboxGroup("성별", "gender", filteredGenderOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("사이즈", "size", sizeOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("색상", "color", colorOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("무늬", "print", patternOptions)}
            <hr className="border-t border-gray-300 my-6" />

            <div className="mb-12 px-1">
                <h3 className="font-semibold mb-4">가격</h3>
                <Slider
                    range // 두 개의 핸들을 가진 범위 슬라이더로 설정
                    min={MIN_PRICE} // 슬라이더의 전체 최소값
                    max={MAX_PRICE} // 슬라이더의 전체 최대값
                    step={1000} // 1000원 단위로 움직이도록 설정
                    value={localPrice} // 슬라이더의 현재 값 (로컬 상태와 연결)
                    onChange={setLocalPrice} // 드래그하는 동안 로컬 상태만 업데이트 (UI 즉시 반영)
                    onChangeComplete={handlePriceChangeComplete} // 드래그가 끝났을 때만 부모 상태 업데이트
                    styles={{
                        track: { backgroundColor: 'var(--kalani-coastal-navy)' },
                        handle: {
                            borderColor: 'var(--kalani-coastal-navy)', // 'black' 대신 CSS 변수 사용
                            borderWidth: 2,
                            backgroundColor: 'white',
                            opacity: 1,
                            // 포커스/활성 상태일 때의 그림자(glow) 색상도 변경
                            boxShadow: '0 0 0 5px rgba(15, 44, 89, 0.2)' // --kalani-coastal-navy (#0F2C59)의 투명도 버전
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