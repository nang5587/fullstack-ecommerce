// 훅 목록
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from '../context/AuthContext';
// import axios from 'axios';
import api from "../api/axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const isSyncing = useRef(false);
    const { isLoggedIn, username } = useAuth();
    const [cartItems, setCartItems] = useState(() => {
        // 비로그인 상태의 장바구니를 먼저 불러오도록 시도
        const unauthCart = localStorage.getItem('cart-unauthenticated');
        if (unauthCart) return JSON.parse(unauthCart);
        const authCart = localStorage.getItem('cart');
        return authCart ? JSON.parse(authCart) : [];
    });
    const [updatingItems, setUpdatingItems] = useState({});
    const hasSynced = useRef(false);
    const token = localStorage.getItem('accessToken');

    // 상태가 변경될 때마다 로컬스토리지에 장바구니 정보를 저장해서
    // 로그인 전 담은 상품을 유지할 수 있도록 함.
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        const token = localStorage.getItem('accessToken');

        // 로그인 되었고, 아직 동기화한 적이 없다면 동기화 시작
        if (isLoggedIn && token && !hasSynced.current) {
            hasSynced.current = true; // 동기화 플래그 ON

            const syncToServer = async () => {
                // const baseUrl = import.meta.env.VITE_BACKEND_URL;
                try {
                    const localCartRaw = localStorage.getItem('cart-unauthenticated');
                    const localCart = localCartRaw ? JSON.parse(localCartRaw) : [];

                    if (localCart.length > 0) {
                        console.log('비로그인 장바구니를 서버에 병합합니다:', localCart);
                        await api.post(`/api/member/cart/add`, {
                            items: localCart.map(item => ({
                                imgname: item.imgname,
                                optionid: item.optionid.toUpperCase(),
                                quantity: item.quantity,
                                size: item.size,
                                price: item.price,
                            }))
                        }, { headers: { Authorization: `Bearer ${token}` } });
                        localStorage.removeItem('cart-unauthenticated');
                    }

                    console.log("서버의 최신 장바구니 목록을 가져옵니다...");
                    const res = await api.get(`/api/member/cart/list`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    const serverItems = res.data.items || [];
                    setCartItems(serverItems);
                    localStorage.setItem('cart', JSON.stringify(serverItems));
                    console.log('✅ 서버 장바구니와 동기화 완료');

                } catch (err) {
                    console.error('❌ 장바구니 동기화 실패', err);
                    hasSynced.current = false; // 실패 시 다시 시도할 수 있도록 플래그 OFF
                }
            };
            syncToServer();
        }
        // 로그아웃 시 상태 초기화
        else if (!isLoggedIn) {
            setCartItems([]);
            localStorage.removeItem('cart');
            hasSynced.current = false; // 로그아웃 시 동기화 플래그 리셋
        }
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn) {
            localStorage.setItem('cart', JSON.stringify(cartItems));
        } else {
            localStorage.setItem('cart-unauthenticated', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoggedIn]);

    const updateQuantity = async (itemId, size, amount) => {
        const itemKey = `${itemId}-${size}`;
        if (updatingItems[itemKey]) return;

        const originalCartItems = cartItems;

        setUpdatingItems(prev => ({ ...prev, [itemKey]: true }));

        setCartItems(prev =>
            prev.map(item =>
                item.optionid === itemId && item.size === size
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            )
        );

        if (isLoggedIn) {
            try {
                // API 요청 직전에 최신 토큰을 다시 가져옵니다.
                const token = localStorage.getItem('accessToken');
                if (!token) throw new Error("로그인 토큰이 없습니다.");

                // const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await api.patch(`/api/member/cart/update`, {
                    optionid: itemId.toUpperCase(),
                    quantityChange: String(amount),
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                // 성공 시 서버의 최신 데이터를 다시 가져와서 최종 동기화 (선택사항이지만 가장 안전함)
                // const res = await axios.get(`http://${baseUrl}/api/member/cart/list`, {
                //     headers: { Authorization: `Bearer ${token}` }
                // });
                // setCartItems(res.data.items || []);

            } catch (err) {
                console.error('❌ 수량 업데이트 실패, 상태를 롤백합니다:', err);
                // 서버에서 보낸 구체적인 에러 메시지가 있다면 출력
                if (err.response) {
                    console.error('서버 응답 에러:', err.response.data);
                    alert(`수량 변경 실패: ${err.response.data.message || '서버 오류'}`);
                } else {
                    alert('수량 변경에 실패했습니다. 네트워크 연결을 확인해주세요.');
                }

                // 롤백 실행
                setCartItems(originalCartItems);
            } finally {
                setUpdatingItems(prev => ({ ...prev, [itemKey]: false }));
            }
        }
    };

    const bulkAddToCart = async (itemsArray) => {// 디테일에서 장바구니 추가 버튼 눌렀을 때
        if (!Array.isArray(itemsArray)) return;
        setCartItems(prev => {
            console.log('prev', prev);

            // prev가 배열이 아니라 객체인 경우를 대비
            const prevArray = Array.isArray(prev) ? prev : (Array.isArray(prev.items) ? prev.items : []);

            const updated = [...prevArray];

            itemsArray.forEach(newItem => {
                const exists = updated.find(
                    item => item.optionid === newItem.optionid && item.size === newItem.size
                );
                if (exists) {
                    exists.quantity += newItem.quantity;
                } else {
                    updated.push(newItem);
                }
            });

            return updated;
        });

        console.log('bulkAddToCart(cartcontext.jsx) :', cartItems);

        const payload = {
            username,
            items: itemsArray.map(item => ({
                imgname: item.imgname,
                optionid: item.optionid.toUpperCase(),
                quantity: item.quantity,
                size: item.size,
                price: item.price,
                color: item.color,
            }))
        };

        console.log('백엔드로 전송할 데이터:', payload);

        if (isLoggedIn) {
            try {
                // const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await api.post(`/api/member/cart/add`, {
                    username,
                    items: itemsArray.map(item => ({
                        imgname: item.imgname,
                        optionid: item.optionid.toUpperCase(),
                        quantity: item.quantity,
                        size: item.size,
                        price: item.price,
                    }))
                }, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (err) {
                console.error("❌ 서버 장바구니 추가 실패:", err);
            }
        }
    };

    const removeItem = async (itemId, size) => {
        setCartItems(prev =>
            prev.filter(item => !(item.optionid === itemId && item.size === size))
        );

        if (isLoggedIn) {
            try {
                // const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await api.delete(`/api/member/cart/remove/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const res = await api.get(`/api/member/cart/list`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setCartItems(res.data.items);
                localStorage.setItem('cart', JSON.stringify(res.data.items));
            } catch (err) {
                console.error('❌ 아이템 삭제 실패:', err);
            }
        }
    };

    const clearCart = async () => {
        setCartItems([]);
        localStorage.removeItem('cart');

        if (isLoggedIn) {
            try {
                // const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await api.delete(`/api/member/cart/remove`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("✅ 장바구니 서버에서도 전체 삭제 완료");
            } catch (err) {
                console.error('❌ 전체 삭제 실패:', err);
            }
        }
    };

    const removeItemsFromCart = async (orderedItems) => {
        // orderedItems는 [{ optionid: 'A', size: 'M' }, ...] 형태의 배열
        const itemsToRemove = new Set(
            orderedItems.map(item => `${item.optionid}-${item.size}`)
        );

        const originalCartItems = [...cartItems]; // 롤백용 원본 저장

        // 낙관적 업데이트: UI에서 주문한 상품들을 즉시 제거
        setCartItems(prev => prev.filter(item =>
            !itemsToRemove.has(`${item.optionid}-${item.size}`)
        ));

        if (isLoggedIn) {
            try {
                const token = localStorage.getItem('accessToken');
                // const baseUrl = import.meta.env.VITE_BACKEND_URL;

                // 1. 백엔드에 주문된 상품들의 'optionid' 목록을 전송합니다.
                // ★★★ size 없이 optionid만 보내도록 수정 ★★★
                await api.patch(`/api/member/cart/remain`, {
                    items: orderedItems.map(item => ({ optionid: item.optionid }))
                }, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 2. 삭제 성공 후, 최신 장바구니 목록을 다시 가져옵니다 (GET 요청)
                console.log("주문 상품 삭제 성공. 최신 장바구니 목록을 다시 불러옵니다...");
                const res = await api.get(`/api/member/cart/list`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                // 3. 서버에서 받은 최신 데이터로 프론트엔드 상태를 최종 동기화합니다.
                setCartItems(res.data.items || []);
                localStorage.setItem('cart', JSON.stringify(res.data.items));
            } catch (err) {
                console.error("❌ 주문된 상품 삭제 또는 목록 조회 실패, 롤백합니다.", err);
                setCartItems(originalCartItems); // 실패 시 롤백
            }
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, updatingItems, updateQuantity, removeItem, clearCart, bulkAddToCart, removeItemsFromCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
