// css
import './react/style.css'
import './react/palette.css';

// 라우터
import { BrowserRouter, Routes, Route } from "react-router-dom";

// components 목록
import Nav from "./components/Nav";
import Footer from "./components/Footer";

import Home from "./components/Home";
import Listing from "./components/Listing";
import SearchListing from './components/SearchListing';

import AdPage from './components/AdPage';
import Detail from "./components/Detail";
import CartPage from './components/CartPage';
import { CartProvider } from './components/CartContext';
import OrderPage from './components/OrderPage';

import SignUp from './components/SignUp';
import SignUpSuccess from './components/SignUpSuccess';
import Login from "./components/Login";

import MyPage from './components/MyPage';
import VerifyPassword from './components/VerifyPassword';
import EditMemberInfo from './components/EditMemberInfo';

import Test from './components/Test';

import ColorPaletteTest from './components/ColorPaletteTest';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="w-full min-h-screen flex flex-col bg-white">
          <header className="w-full h-24 flex flex-col flex-shrink-0">
            <Nav />
          </header>

          <main className="w-full flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Listing />} />
              <Route path="/search" element={<SearchListing />} />
              <Route path="/detail/:productId" element={<Detail />} />
              <Route path="/promotion/:productId" element={<AdPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/order" element={<OrderPage />} />
              <Route path="/sign" element={<SignUp />} />
              <Route path="/signup-success" element={<SignUpSuccess />} />
              <Route path="/login" element={<Login />} />
              <Route path="/mypage/*" element={<MyPage />} />
              <Route path="/mypage/verify" element={<VerifyPassword />} />
              <Route path="/mypage/edit" element={<EditMemberInfo />} />
              <Route path="/color" element={<ColorPaletteTest />} />
              <Route path="/test" element={<Test />} />
            </Routes>
          </main>

          <footer className="w-full h-20">
            <Footer />
          </footer>
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App;