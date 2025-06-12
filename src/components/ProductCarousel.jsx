// swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

// component 목록
import ProductCard from "../components/ProductCard";

export default function ProductCarousel({title}) {
    const [products, setProducts] = useState([]);
    
    useEffect(()=>{
        const fetchProducts = async () => {
            try{
                const baseUrl = import.meta.env.VITE_BACKEND_URL;
                const res = await fetch(`http://${baseUrl}:8080/api/public/goods`);
                const data = await res.json();
                setProducts(data);
                console.log(products);
            }
            catch (err) {
                console.error("상품 데이터를 불러오는 데 실패함 : ", err);
            }
        };
        fetchProducts()
    }, []);

export default function ProductCarousel({title}) {
    return (
        <div className="ml-10 mb-50">
            <h2 className="text-xl font-bold mb-3">
                {title}
            </h2>
            <Swiper
                modules={[]}
                spaceBetween={24}
                // 'auto'로 설정하면 각 슬라이드의 너비를 그대로 유지합니다.
                slidesPerView={'auto'}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id} className="!w-auto"> {/* !w-auto: 카드 고유 너비 사용 */}
                        <ProductCard product={product} />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}
