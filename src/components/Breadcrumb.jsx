import categoryKR from "../local/categoryKR";

export default function Breadcrumb({ filters, keyword }) {
    const translate = (key) => {
        if (Array.isArray(key)) {
            return key.map(k => categoryKR[k] || k).join(", ");
        }
        return categoryKR[key] || key;
    };

    const hasMain = filters.main && filters.main.length > 0;
    const hasMid = Array.isArray(filters.mid) && filters.mid.length > 0;
    const hasSub = Array.isArray(filters.sub) && filters.sub.length > 0;

    const lastActiveCategory = hasSub ? 'sub' : hasMid ? 'mid' : 'main';

    return (
        <div className="mb-4 text-sm text-gray-700">
            <p className="text-2xl font-bold pb-4 border-b border-gray-300">
                {hasMain && (
                    <span className={lastActiveCategory === 'main' ? 'text-kalani-navy' : 'text-kalani-gold'}>
                        {translate(filters.main)}
                    </span>
                )}
                {hasMid && (
                    <>
                        <span className="text-kalani-gold"> &gt; </span>
                        {/* 마지막 활성 카테고리가 'mid'일 때만 강조색 적용 */}
                        <span className={lastActiveCategory === 'mid' ? 'text-kalani-navy' : 'text-kalani-gold'}>
                            {translate(filters.mid)}
                        </span>
                    </>
                )}

                {/* 3. 소분류 */}
                {hasSub && (
                    <>
                        <span className="text-kalani-gold"> &gt; </span>
                        {/* 마지막 활성 카테고리가 'sub'일 때만 강조색 적용 (사실상 항상 적용됨) */}
                        <span className={lastActiveCategory === 'sub' ? 'text-kalani-navy' : 'text-kalani-gold'}>
                            {translate(filters.sub)}
                        </span>
                    </>
                )}
                {keyword && (
                    <span className="px-2 py-1 text-kalani-navy rounded-full text-sm font-medium">
                        #{keyword}
                    </span>
                )}
            </p>
        </div>
    );
}