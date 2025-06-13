
export default function LookBook({ imageSrc, items }) {
    return (
        <div className="relative w-[400px] h-[800px]">
            <img src={imageSrc} alt="Model" className="w-full h-full object-contain" />

            {items.map((item, idx) => (
                <div
                    key={idx}
                    className="absolute group"
                    style={{ top: item.y, left: item.x }}
                >
                    <div className="w-4 h-4 bg-blue-500 rounded-full cursor-pointer" />

                    {/* Hover시 상세정보 */}
                    <div className="absolute left-6 top-1 bg-white text-black border rounded-md p-2 text-sm opacity-0 group-hover:opacity-100 transition">
                        <a href={`/product/${item.fullcode}`} className="hover:underline">
                            {item.name} <br />
                            ₩{item.price.toLocaleString()}
                        </a>
                    </div>
                </div>
            ))}
        </div>
    )
}
