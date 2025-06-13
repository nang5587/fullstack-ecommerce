import { useState, useEffect } from 'react';

const genderOptions = ['여성', '남성', '키즈'];
const colorOptions = ['블랙', '화이트', '핑크', '베이지'];
const patternOptions = ['솔리드', '체크', '스트라이프'];
const mainCategories = ['top', 'bottom', 'underwear', 'acc', 'kids', 'swimwear', 'skirts_dress'];

const categoryTree = {
    top: {
        sleeveless: ['top', 't_shirts', 'outer'],
        long: ['t_shirts', 'outer', 'sweatshirts', 'shirts', 'zip_ups', 'knitwear', 'o'],
        short: ['t_shirts'],
        shorts: ['t_shirts', 'shirts']
    },
    bottom: {
        long: ['leggings', 'jogger', 'socks', 'cotton', 'training', 'cargo', 'jeans', 'slacks'],
        short: ['leggings'],
        shorts: ['training', 'jeans', 'leggings', 'cotton']
    },
    // 필요한 경우 다른 대분류도 추가 가능
};

export default function SidebarFilters({ filters, setFilters }) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    // 체크박스용 핸들러 (중분류, 소분류, 성별, 색상, 무늬)
    const handleCheckbox = (category, value) => {
        setLocalFilters(prev => {
            const prevValues = prev[category] || [];
            const newValues = prevValues.includes(value)
                ? prevValues.filter(v => v !== value)
                : [...prevValues, value];
            return { ...prev, [category]: newValues };
        });
    };

    // 라디오버튼용 핸들러 (대분류)
    const handleRadio = (category, value) => {
        setLocalFilters(prev => ({
            ...prev,
            [category]: value
        }));
    };

    const selectedMain = localFilters.main;
    const mids = selectedMain ? Object.keys(categoryTree[selectedMain] || {}) : [];
    const subs = selectedMain && localFilters.mid
        ? localFilters.mid.flatMap(mid => categoryTree[selectedMain]?.[mid] || [])
        : [];

    // 대분류(main)는 단일 문자열
    // mid, sub, gender, color, pattern 등은 배열

    // 초기값 처리 (localFilters가 undefined일 때 대비)
    const safeArray = (arr) => Array.isArray(arr) ? arr : [];

    return (
        <div className="w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white p-4 sticky top-16">

            <div className="mb-4">
                <h3 className="font-semibold">대분류</h3>
                {mainCategories.map(main => (
                    <label key={main} className="block cursor-pointer">
                        <input
                            type="radio"
                            name="mainCategory"
                            value={main}
                            checked={localFilters.main === main}
                            onChange={() => handleRadio('main', main)}
                        />{' '}
                        {main}
                    </label>
                ))}
            </div>

            {mids.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold">중분류</h3>
                    {mids.map(mid => (
                        <label key={mid} className="block cursor-pointer">
                            <input
                                type="checkbox"
                                checked={safeArray(localFilters.mid).includes(mid)}
                                onChange={() => handleCheckbox('mid', mid)}
                            />{' '}
                            {mid}
                        </label>
                    ))}
                </div>
            )}

            {subs.length > 0 && (
                <div className="mb-4">
                    <h3 className="font-semibold">소분류</h3>
                    {[...new Set(subs)].map(sub => (
                        <label key={sub} className="block cursor-pointer">
                            <input
                                type="checkbox"
                                checked={safeArray(localFilters.sub).includes(sub)}
                                onChange={() => handleCheckbox('sub', sub)}
                            />{' '}
                            {sub}
                        </label>
                    ))}
                </div>
            )}

            <div className="mb-4">
                <h3 className="font-semibold">성별</h3>
                {genderOptions.map(g => (
                    <label key={g} className="block cursor-pointer">
                        <input
                            type="checkbox"
                            checked={safeArray(localFilters.gender).includes(g)}
                            onChange={() => handleCheckbox('gender', g)}
                        />{' '}
                        {g}
                    </label>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="font-semibold">색상</h3>
                {colorOptions.map(color => (
                    <label key={color} className="block cursor-pointer">
                        <input
                            type="checkbox"
                            checked={safeArray(localFilters.color).includes(color)}
                            onChange={() => handleCheckbox('color', color)}
                        />{' '}
                        {color}
                    </label>
                ))}
            </div>

            <div className="mb-4">
                <h3 className="font-semibold">무늬</h3>
                {patternOptions.map(p => (
                    <label key={p} className="block cursor-pointer">
                        <input
                            type="checkbox"
                            checked={safeArray(localFilters.pattern).includes(p)}
                            onChange={() => handleCheckbox('pattern', p)}
                        />{' '}
                        {p}
                    </label>
                ))}
            </div>
        </div>
    );
}
