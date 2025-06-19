// 훅 목록
import { createContext, useContext, useEffect, useState } from "react"

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState(() => {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (newItem) => {
        setCartItems(prev => {
            const exists = prev.find(
                item => newItem.id === item.id && newItem.size === item.size
            );
            if (exists) {
                return prev.map(item =>
                    item.id === newItem.id && item.size === newItem.id ? { ...item, quantity: item.quantity + newItem.quantity }
                        : item
                );
            }
            else {
                return [...prev, newItem];
            }
        });
    };

    const updateQuantity = (itemId, size, amount) => {
        setCartItems(prev =>
            prev.map(item =>
                item.id === itemId && item.size === size
                    ? { ...item, quantity: Math.max(1, item.quantity + amount) }
                    : item
            )
        );
    };

    const removeItem = (itemId, size) => {
        setCartItems(prev => prev.filter(item => !(item.id === itemId && item.size === size)));
    }

    const clearCart = () => {
        setCartItems([]);
    }

    return (
        <CartContext.Provider value={{cartItems, addToCart, updateQuantity, removeItem, clearCart}}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
