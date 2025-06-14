import { useState, useEffect } from 'react';

import colorMap from '../local/colorMap';
import ColorSwatch from '../UI/ColorSwatch';
import colorOptions from '../local/colorOptions'
import categoryTree from '../local/categoryTree'
import categoryKR from '../local/categoryKR';

const genderOptions = ['f', 'm', 'u'];

const patternOptions = ["graphic", "striped", "solid", "checkered", "dott", "pattern"];
const mainCategories = ['top', 'bottom', 'underwear', 'acc', 'kids', 'swimwear', 'skirts_dress'];

import { useNavigate } from 'react-router-dom';


export default function SidebarFilters({ filters, setFilters }) {
    const safeArray = (arr) => Array.isArray(arr) ? arr : arr ? [arr] : [];
    // URL
    const navigate = useNavigate();
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        const searchParams = new URLSearchParams();
        Object.entries(localFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => searchParams.append(key, v));
            } else if (value) {
                searchParams.set(key, value);
            }
        });
        navigate(`/products?${searchParams.toString()}`);
    }, [localFilters]);

    const renderCheckboxGroup = (title, category, options) => (
        <div className="mb-4">
            <h3 className="font-semibold mb-4">{title}</h3>
            {category === "color" ? (
                <div className="grid grid-cols-4 place-items-center gap-1">
                    {options.map((option) => {
                        const isChecked = safeArray(localFilters[category]).includes(option);
                        return (
                            <label key={option} className="cursor-pointer w-12 h-12 flex items-center justify-center">
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
                    const isChecked = safeArray(localFilters[category]).includes(option);
                    return (
                        <label key={option} className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleCheckbox(category, option)}
                                className="form-checkbox"
                            />
                            <span
                                className={`transition-colors ${isChecked ? "text-gray-700 font-semibold" : "text-gray-400"
                                    }`}
                            >
                                {categoryKR[option] || option}
                            </span>
                        </label>
                    );
                })
            )}
        </div>
    );



    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    useEffect(() => {
        setFilters(localFilters);
    }, [localFilters]);

    const handleCheckbox = (category, value) => {
        setLocalFilters((prev) => {
            const prevValues = prev[category] || [];
            const newValues = prevValues.includes(value)
                ? prevValues.filter((v) => v !== value)
                : [...prevValues, value];
            return { ...prev, [category]: newValues };
        });
    };

    const handleRadio = (category, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [category]: value,
        }));
    };

    const selectedMain = localFilters.main;
    const mids = selectedMain ? Object.keys(categoryTree[selectedMain] || {}) : [];
    const subs = selectedMain && localFilters.mid
        ? localFilters.mid.flatMap((mid) => categoryTree[selectedMain]?.[mid] || [])
        : [];

    const filteredGenderOptions = localFilters.main === 'skirts_dress' ? ['여성'] : genderOptions;

    return (
        <div
            className="w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white p-4 sticky top-16"
            style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
            }}
        >
            <div className="mb-4">
                <h3 className="font-semibold mb-4">대분류</h3>
                <div className="space-y-1">
                    {mainCategories.map((main) => (
                        <div
                            key={main}
                            onClick={() => handleRadio('main', main)}
                            className={`
                            cursor-pointer px-1 py-0.5
                            ${localFilters.main === main ? 'text-gray-700 font-semibold' : 'text-gray-400'}
                    `}
                        >
                            {categoryKR[main] || main}
                        </div>
                    ))}
                </div>
            </div>

            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("중분류", "mid", mids)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("소분류", "sub", [...new Set(subs)])}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("성별", "gender", filteredGenderOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("색상", "color", colorOptions)}
            <hr className="border-t border-gray-300 my-6" />
            {renderCheckboxGroup("무늬", "pattern", patternOptions)}
        </div>
    );
}
