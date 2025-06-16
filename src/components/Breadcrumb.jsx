import categoryKR from "../local/categoryKR";

export default function Breadcrumb({ filters, keyword }) {
    const translate = (key) => {
        if (Array.isArray(key)) {
            return key.map(k => categoryKR[k] || k).join(", ");
        }
        return categoryKR[key] || key;
    };

    const hasMid = Array.isArray(filters.mid) && filters.mid.length > 0;
    const hasSub = Array.isArray(filters.sub) && filters.sub.length > 0;

    return (
        <div className="mb-4 text-sm text-gray-700">
            {keyword ? (
                <p className="text-2xl font-medium pb-4 border-b border-gray-300">
                    <span className="text-black font-semibold">"{keyword}"</span>에 대한 검색 결과
                </p>
            ) : (
                <p className="text-2xl font-bold pb-4 border-b border-gray-300">
                    {filters.main && <span>{translate(filters.main)}</span>}
                    {hasMid && (
                        <span className="text-black">
                            &nbsp;&gt;&nbsp;
                            {translate(filters.mid)}
                        </span>
                    )}
                    {hasSub && (
                        <span className="text-black">
                            &nbsp;&gt;&nbsp;
                            {translate(filters.sub)}
                        </span>
                    )}
                </p>
            )}
        </div>
    );
}
