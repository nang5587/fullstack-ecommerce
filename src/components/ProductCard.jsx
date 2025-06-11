
export default function ProductCard({product}) {
    return (
        <div className="group w-64 flex-shrink-0"> {/* w-64: 너비 고정, flex-shrink-0: 줄어들지 않음 */}
            <a href="#" className="block">
                {/* 상품 이미지 영역 */}
                <div className="aspect-square w-full overflow-hidden rounded-md bg-gray-200">
                    <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* 상품 정보 영역 */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                    <p className="mt-1 text-lg font-semibold text-gray-900">{product.price.toLocaleString()}원</p>
                </div>
            </a>
        </div>
    )
}
