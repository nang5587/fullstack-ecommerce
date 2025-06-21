// 훅 목록
import { createContext, useContext, useEffect, useState, useRef } from "react"
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

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
        if (!isLoggedIn) {
            setCartItems([]);
            localStorage.removeItem('cart');
        }
    }, [isLoggedIn]);

    // 로그인 시 로컬스토리지 내용 자동 추가 & 서버 장바구니 가져오기
    // useEffect(() => {
    //     if (isSyncing.current) return;
    //     const stored = localStorage.getItem('cart');
    //     const parsedCart = stored ? JSON.parse(stored) : [];

    //     const baseUrl = import.meta.env.VITE_BACKEND_URL;

    //     if (token && username) {
    //         const syncToServer = async () => {
    //             try {
    //                 if (parsedCart.length > 0) {
    //                     await axios.post(`http://${baseUrl}/api/member/cart/add`, {
    //                         username,
    //                         items: parsedCart.map(item => ({
    //                             imgname: item.imgname,
    //                             optionid: item.optionid.toUpperCase(),
    //                             quantity: item.quantity,
    //                             size: item.size,
    //                             price: item.price,
    //                         }))
    //                     }, {
    //                         headers: {
    //                             Authorization: `Bearer ${token}`
    //                         }
    //                     });
    //                 }

    //                 // 🔥 서버 장바구니 가져오기 (반드시 해야 함!)
    //                 console.log("list 불러오기 전 토큰", token);
    //                 const res = await axios.get(`http://${baseUrl}/api/member/cart/list`, {
    //                     headers: {
    //                         Authorization: `Bearer ${token}`
    //                     }
    //                 });

    //                 // 🔁 서버에서 받은 장바구니를 상태로 동기화
    //                 setCartItems(res.data.items); // 실제 렌더링에 쓸 건 이 배열
    //                 localStorage.setItem('cart', JSON.stringify(res.data.items));

    //                 // localStorage.setItem('cart', JSON.stringify(res.data));
    //                 console.log('서버 장바구니와 동기화 완료');

    //             } catch (err) {
    //                 console.error('장바구니 동기화 실패', err);
    //             }
    //         };

    //         syncToServer();
    //     }
    // }, [isLoggedIn, token, username]);

    useEffect(() => {
        // 이미 동기화가 진행 중이거나 완료되었다면 실행하지 않음
        if (isSyncing.current) return;

        const baseUrl = import.meta.env.VITE_BACKEND_URL;

        if (token && username) {
            // 동기화 시작 플래그 설정
            isSyncing.current = true;

            const syncToServer = async () => {
                try {
                    // 1. 비로그인 시 담아둔 로컬 장바구니 가져오기
                    const localCartRaw = localStorage.getItem('cart-unauthenticated');
                    const localCart = localCartRaw ? JSON.parse(localCartRaw) : [];

                    // 2. 로컬 장바구니에 상품이 있으면 서버에 병합 요청
                    if (localCart.length > 0) {
                        console.log('비로그인 장바구니를 서버와 동기화합니다:', localCart);
                        await axios.post(`http://${baseUrl}/api/member/cart/add`, {
                            username,
                            items: localCart.map(item => ({
                                imgname: item.imgname,
                                optionid: item.optionid.toUpperCase(),
                                quantity: item.quantity,
                                size: item.size,
                                price: item.price,
                            }))
                        }, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        // 동기화가 끝난 비로그인 장바구니는 삭제
                        localStorage.removeItem('cart-unauthenticated');
                    }

                    // 3. 최종적으로 서버의 장바구니 데이터를 가져와 상태에 적용 (이것이 유일한 정보 소스)
                    console.log("서버의 최신 장바구니 목록을 가져옵니다...");
                    const res = await axios.get(`http://${baseUrl}/api/member/cart/list`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    // 4. 서버에서 받은 장바구니를 상태와 'cart' 로컬스토리지에 동기화
                    setCartItems(res.data.items || []); // 서버 응답이 비었을 경우를 대비
                    localStorage.setItem('cart', JSON.stringify(res.data.items || []));

                    console.log('✅ 서버 장바구니와 동기화 완료');

                } catch (err) {
                    console.error('❌ 장바구니 동기화 실패', err);
                    // 실패 시에도 플래그를 풀어주어 재시도 가능하게 할 수 있음 (선택적)
                    isSyncing.current = false;
                }
            };

            syncToServer();
        } else {
            // 로그아웃 시 동기화 플래그 리셋
            isSyncing.current = false;
        }
    }, [isLoggedIn, token, username]);

    // useEffect(() => {
    //     console.log('cartItems 상태 업데이트:', cartItems);
    // }, [cartItems]);
    useEffect(() => {
        if (!isLoggedIn) {
            // 비로그인 상태에서는 다른 키값으로 저장하여 로그인 시의 장바구니와 분리
            localStorage.setItem('cart-unauthenticated', JSON.stringify(cartItems));
        }
    }, [cartItems, isLoggedIn]);

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
                const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await axios.post(`http://${baseUrl}/api/member/cart/add`, {
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


    const updateQuantity = async (itemId, size, amount) => {
        const itemKey = `${itemId}-${size}`;
        if (updatingItems[itemKey]) return;

        const originalCartItems = [...cartItems];

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
                const baseUrl = import.meta.env.VITE_BACKEND_URL;

                const payload = {
                    optionid: itemId.toUpperCase(),
                    quantityChange: String(amount),
                };
                console.log('🛫 서버로 전송할 수량 변경 데이터:', payload);
                console.log('🛫 데이터:', token);

                const res = await axios.patch(`http://${baseUrl}/api/member/cart/update`,
                    {
                        // 페이로드: 어떤 상품의 수량을 얼마나 바꿀지
                        optionid: itemId.toUpperCase(),
                        quantityChange: String(amount),
                    },
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                // 서버의 최종 응답으로 프론트엔드 상태를 동기화합니다.
                // 백엔드가 { "items": [...] } 구조로 응답한다고 가정합니다.
                setCartItems(res.data.items || []);
                console.log("✅ 수량 변경 성공, 서버로부터 받은 최신 데이터:", res.data);
                localStorage.setItem('cart', JSON.stringify(res.data.items));
            } catch (err) {
                // 4. ★★★ 실패 시 롤백 ★★★
                console.error('❌ 수량 업데이트 실패, 상태를 롤백합니다:', err);
                alert('수량 변경에 실패했습니다. 잠시 후 다시 시도해주세요.');
                setCartItems(originalCartItems); // UI를 원래대로 되돌림
                localStorage.setItem('cart', JSON.stringify(originalCartItems)); // 로컬스토리지도 되돌림
            } finally {
                // 5. 성공/실패 여부와 관계없이 로딩 상태 종료
                setUpdatingItems(prev => ({ ...prev, [itemKey]: false }));
            }
        }
    };

    const removeItem = async (itemId, size) => {
        setCartItems(prev =>
            prev.filter(item => !(item.optionid === itemId && item.size === size))
        );

        if (isLoggedIn) {
            try {
                const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await axios.delete(`http://${baseUrl}/api/member/cart/remove/${itemId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const res = await axios.get(`http://${baseUrl}/api/member/cart/list`, {
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
                const baseUrl = import.meta.env.VITE_BACKEND_URL;

                await axios.delete(`http://${baseUrl}/api/member/cart/remove`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                console.log("✅ 장바구니 서버에서도 전체 삭제 완료");
            } catch (err) {
                console.error('❌ 전체 삭제 실패:', err);
            }
        }
    };

    return (
        <CartContext.Provider value={{ cartItems, updatingItems, updateQuantity, removeItem, clearCart, bulkAddToCart }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
