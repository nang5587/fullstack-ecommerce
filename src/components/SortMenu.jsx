
// 백엔드 API와 약속된 정렬 옵션 값들
const sortOptions = [
    { value: 'newest', label: '신상품순' },
    { value: 'priceAsc', label: '낮은 가격순' },
    { value: 'priceDesc', label: '높은 가격순' },
];

export default function SortMenu({ sortOrder, onSortChange }) {
    return (
        <div className="flex justify-end mb-4 pr-4">
            <select
                value={sortOrder}
                onChange={(e) => onSortChange(e.target.value)}
                className="p-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-gray-700 focus:outline-none"
            >
                {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    )
}
