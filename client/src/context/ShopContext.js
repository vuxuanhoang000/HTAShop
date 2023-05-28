import { createContext, useReducer } from "react";
import { setItemLocalStorage } from "../utils/localStorage";

export const SHOP_CART_KEY = "cvbvbsf";
export const CART_ADD_ITEM = "CART_ADD_ITEM";
export const CART_REMOVE_ITEM = "CART_REMOVE_ITEM";
export const CART_CLEAR = "CART_CLEAR";
export const SAVE_SHIPPING_ADDRESS = "SAVE_SHIPPING_ADDRESS";
export const SAVE_PAYMENT_METHOD = "SAVE_PAYMENT_METHOD";

export const ShopContext = createContext();

const initState = {
    cart: localStorage.getItem(SHOP_CART_KEY)
        ? JSON.parse(localStorage.getItem(SHOP_CART_KEY))
        : {
              cartItems: [],
              shippingAddress: {
                  fullName: "",
                  address: "",
                  phoneNumber: "",
              },
              paymentMethod: "",
          },
};

function reducer(state, action) {
    switch (action.type) {
        case CART_ADD_ITEM: {
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find((item) => item._id === newItem._id);
            const cartItems = existItem ? state.cart.cartItems.map((item) => (item._id === existItem._id ? newItem : item)) : [...state.cart.cartItems, newItem];
            const updateCart = { ...state.cart, cartItems };
            setItemLocalStorage(SHOP_CART_KEY, JSON.stringify(updateCart));
            return {
                ...state,
                cart: updateCart,
            };
        }
        case CART_REMOVE_ITEM: {
            const cartItems = state.cart.cartItems.filter((item) => item._id !== action.payload._id);
            const updateCart = { ...state.cart, cartItems };
            setItemLocalStorage(SHOP_CART_KEY, JSON.stringify(updateCart));
            return {
                ...state,
                cart: updateCart,
            };
        }
        case CART_CLEAR: {
            const updateCart = { ...state.cart, cartItems: [] };
            setItemLocalStorage(SHOP_CART_KEY, JSON.stringify(updateCart));
            return {
                ...state,
                cart: {
                    ...state.cart,
                    cartItems: [],
                },
            };
        }
        case SAVE_SHIPPING_ADDRESS: {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    shippingAddress: {
                        ...state.cart.shippingAddress,
                        ...action.payload,
                    },
                },
            };
        }
        case SAVE_PAYMENT_METHOD: {
            return {
                ...state,
                cart: {
                    ...state.cart,
                    paymentMethod: action.payload,
                },
            };
        }
        default: {
            return { ...state };
        }
    }
}

export function ShopProvider(props) {
    const [state, dispatch] = useReducer(reducer, initState);
    const value = { state, dispatch };
    return <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>;
}
