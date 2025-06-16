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
import Detail from "./components/Detail";
import Login from "./components/Login";
import ColorPaletteTest from './components/ColorPaletteTest';

function App() {
  return (
    <BrowserRouter>
      <div className="w-full min-h-screen flex flex-col bg-white">
        <header className="w-full h-24 flex flex-col flex-shrink-0">
          <Nav />
        </header>

        <main className="w-full flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Listing />} />
            <Route path="/search" element={<SearchListing />} />
            <Route path="/detail" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/test" element={<ColorPaletteTest />} />
          </Routes>
        </main>

        <footer className="w-full h-20">
          <Footer />
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App;