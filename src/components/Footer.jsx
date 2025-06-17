// css
import '../react/style.css'

export default function Footer() {
    return (
            <div className="w-full flex flex-col bg-white border-t border-zinc-200">
                <div className="flex justify-between px-10 py-10">
                    <div>
                        <a href="/" id="font" className="flex flex-row items-baseline gap-2 flex-shrink-0 text-3xl text-black hover:text-kalani-gold">
                            {/* 📢 스토어명 정하기 */}
                            <h1>KALANI</h1>
                            {/* <span>STORE</span> */}
                        </a>
                    </div>
                    <div className="text-gray-700 text-xs text-right">
                        <h4 className="font-bold mb-2">회사 정보</h4>
                        <p>상호: KALANI</p>
                        <p>대표: 강나현, 홍지민</p>
                        <p>사업자번호: 123-45-67890</p>
                        <p>통신판매업신고: 2025-부산금정-0001</p>
                    </div>
                </div>

                <div className="mb-5 text-center text-xs text-gray-500">
                    © 2025 KALANI. All rights reserved.
                </div>
            </div>
    )
}
