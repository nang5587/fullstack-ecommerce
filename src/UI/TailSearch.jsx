// 이미지 목록
import tailSearchIcon from '../assets/TailSearchIcon.svg';

// 훅 목록
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function TailSearch() {
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        const trimmedTerm = searchTerm.trim();
        if(trimmedTerm){
            navigate(`/search?keyword=${encodeURIComponent(trimmedTerm)}`);
            setSearchTerm("");
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    }

    return (
        //    'htmlFor' 속성은 아래 input의 'id'와 일치해야 합니다.
        <label
            htmlFor="product-search"
            className="w-full px-3.5 py-2 rounded-md outline outline-gray-200 flex items-center gap-2 cursor-text 
                    focus-within:outline-kalani-gold focus-within:outline-2">
            <div className="flex-shrink-0">
                <img src={tailSearchIcon} alt="Search Icon" className="w-5 h-5" />
            </div>
            <input
                type="text"
                id="product-search" // label의 'htmlFor'와 연결
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={handleKeyDown}
                className="
                            w-full                          // 너비를 꽉 채움
                            bg-transparent                  // 배경색 투명하게
                            text-gray-900                   // 입력되는 텍스트 색상
                            placeholder:text-gray-500       // placeholder 텍스트 색상
                            text-sm                         // 폰트 크기
                            font-medium                     // 폰트 굵기
                            focus:outline-none              // 포커스 시 생기는 기본 테두리 제거 (중요!)
                            border-none                     // 기본 테두리 제거
                            "
            />
        </label>
    )
}
