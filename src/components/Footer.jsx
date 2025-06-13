
export default function Footer() {
    return (
            <div className="w-full flex flex-col border-t border-zinc-200">
                <div className="flex justify-between px-10 pt-5">
                    <div>
                        <a href="/" id="test" className="flex flex-row items-baseline gap-2 flex-shrink-0 text-3xl text-black">
                            {/* 📢 스토어명 정하기 */}
                            <h1>NAVER</h1>
                            <span>STORE</span>
                        </a>
                    </div>
                    <div className="text-gray-700 text-xs text-right">
                        <h4 className="font-bold mb-2">회사 정보</h4>
                        <p>상호: NAVER STORE</p>
                        <p>대표: 홍길동</p>
                        <p>사업자번호: 123-45-67890</p>
                        <p>통신판매업신고: 2025-서울강남-0001</p>
                    </div>
                </div>

                <div className="mb-5 text-center text-xs text-gray-500">
                    © 2025 NAVER STORE. All rights reserved.
                </div>
            </div>
    )
}
