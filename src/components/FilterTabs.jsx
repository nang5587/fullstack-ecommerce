// src/components/FilterTabs.js (새 파일)

import React from 'react';

export default function FilterTabs({ options, currentFilter, onFilterChange }) {
    return (
        <div className="flex items-center justify-center space-x-2 mb-8">
            {options.map((option) => (
                <button
                    key={option}
                    onClick={() => onFilterChange(option)}
                    className={`
            px-4 py-2 text-sm font-semibold rounded-sm transition-colors duration-200
            ${currentFilter === option
                            ? 'bg-kalani-navy text-white shadow-nm' // 활성 탭 스타일
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300' // 비활성 탭 스타일
                        }
            `}
                >
                    {option}
                </button>
            ))}
        </div>
    );
}