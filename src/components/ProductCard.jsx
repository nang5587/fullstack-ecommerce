
export default function ProductCard({ product }) {
    const productCode = product.imgname;
    const baseUrl = import.meta.env.VITE_BACKEND_URL;
    const imgUrl = `http://${baseUrl}/api/public/img/goods/${productCode}.jpg`;
    console.log(typeof product.price);
    return (
        <div className="group w-64 flex-shrink-0"> {/* w-64: 너비 고정, flex-shrink-0: 줄어들지 않음 */}
            <a href="#" className="block">
                {/* 상품 이미지 영역 */}
                <div className="w-[256px] h-96 overflow-hidden bg-gray-200">
                    <img
                        src={imgUrl}
                        alt={product.productName}
                        onError={(e) => { e.target.src = 'src/assets/위츄.jpeg'; }}
                        className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                    />
                </div>

                {/* 상품 정보 영역 */}
                <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-800">{product.productName}</h3>
                    <p className="mt-1 text-base font-semibold text-gray-800">{product.price.toLocaleString('ko-KR')}원</p>
                </div>
            </a>
        </div>
    )
}

