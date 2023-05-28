import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";

import AdminPage from "./pages/admin";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminCategoryPage from "./pages/admin/AdminCategoryPage";
import AdminBrandPage from "./pages/admin/AdminBrandPage";
import AdminCarouselPage from "./pages/admin/AdminCarouselPage";
import AdminProductsPage from "./pages/admin/product";
import AdminCreateProductPage from "./pages/admin/product/AdminCreateProductPage";
import AdminUpdateProductPage from "./pages/admin/product/AdminUpdateProductPage";

import AuthPage from "./pages/auth";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";

import HomePage from "./pages/HomePage";
import ShopPage from "./pages/ShopPage";
import Index from "./pages";
import ProductDetailPage from "./pages/ProductDetailPage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserPage from "./pages/user";
import UserProfilePage from "./pages/user/UserProfilePage";
import UserChangePasswordPage from "./pages/user/UserChangePasswordPage";
import UserPurchasePage from "./pages/user/UserPurchasePage";
import UserPurchaseDetailPage from "./pages/user/UserPurchaseDetailPage";
import AdminOrderPage from "./pages/admin/AdminOrderPage";
import AdminUserPage from "./pages/admin/AdminUserPage";
import NotFoundPage from "./pages/NotFoundPage";

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <Routes>
                    <Route element={<AdminPage />}>
                        <Route path="/admin" element={<AdminDashboardPage />} />
                        <Route path="/admin/orders" element={<AdminOrderPage />} />
                        <Route path="/admin/users" element={<AdminUserPage />} />
                        <Route path="/admin/categories" element={<AdminCategoryPage />} />
                        <Route path="/admin/brands" element={<AdminBrandPage />} />
                        <Route path="/admin/products" element={<AdminProductsPage />} />
                        <Route path="/admin/product/new" element={<AdminCreateProductPage />} />
                        <Route path="/admin/product/:id/edit" element={<AdminUpdateProductPage />} />
                        <Route path="/admin/carousels" element={<AdminCarouselPage />} />
                    </Route>

                    <Route element={<AuthPage />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>

                    <Route element={<Index />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/shop" element={<ShopPage />} />
                        <Route path="/product/:slug" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route element={<UserPage />}>
                            <Route path="/user/profile" element={<UserProfilePage />} />
                            <Route path="/user/change-password" element={<UserChangePasswordPage />} />
                            <Route path="/orders" element={<UserPurchasePage />} />
                            <Route path="/order/:id" element={<UserPurchaseDetailPage />} />
                        </Route>
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
