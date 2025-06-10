import tailSearchIcon from '../assets/TailSearchIcon.svg';

export default function TailSearch() {
    return (
        // 1. 최상위 div를 label 태그로 변경하여 접근성을 높입니다. 
        //    이 label을 클릭하면 연결된 input에 자동으로 포커스가 갑니다.
        //    'htmlFor' 속성은 아래 input의 'id'와 일치해야 합니다.
        <label
            htmlFor="product-search"
            className="self-stretch px-3.5 py-2.5 rounded-md outline outline-gray-200 flex items-center gap-2 cursor-text focus-within:outline-blue-500 focus-within:outline-2">
            <div className="flex-shrink-0"> {/* 아이콘이 찌그러지지 않도록 flex-shrink-0 추가 */}
                <img src={tailSearchIcon} alt="Search Icon" className="w-5 h-5" />
            </div>

            <input
                type="text"
                id="product-search" // label의 'htmlFor'와 연결
                placeholder="상품명 또는 브랜드 입력" // 'div' 안의 텍스트는 placeholder로 바꿉니다.
                // 3. input의 기본 스타일을 제거하고 우리 디자인에 맞게 커스텀합니다.
                className="
                            w-full                          // 너비를 꽉 채움
                            bg-transparent                  // 배경색 투명하게
                            text-gray-900                   // 입력되는 텍스트 색상
                            placeholder:text-gray-500       // placeholder 텍스트 색상
                            text-sm                         // 폰트 크기
                            font-medium                     // 폰트 굵기
                            font-['Inter']                  // 폰트 종류 (프로젝트에 Inter 폰트가 로드되어야 함)
                            focus:outline-none              // 포커스 시 생기는 기본 테두리 제거 (중요!)
                            border-none                     // 기본 테두리 제거
                            "
            />
        </label>
    )
}
