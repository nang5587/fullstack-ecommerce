import './Detail.css'

export default function Detail() {
    return (
        <div className="w-11/12 h-full gap-12">
            {/* 디테일 사진 */}
            <div class="flex w-1/2 h-[654.58px]">
                {/* 미니 디테일 */}
                <div className="pr-5 flex justify-center items-start">
                    <div
                        className="min-w-20 h-[654.58px] overflow-y-auto flex flex-col gap-2.5 scroll-smooth scrollbar-hide"
                    >
                        {/* 여러 미니 이미지 예시 */}
                        {Array.from({ length: 10 }).map((_, idx) => (
                            <div
                                key={idx}
                                className="outline outline-offset-[-1px] outline-white flex justify-start items-start"
                            >
                                <div className="w-14 h-20 relative overflow-hidden">
                                    <img
                                        className="w-14 h-20 object-cover rounded-[5px]"
                                        src={`src/assets/배너${(idx % 5) + 1}.jpg`}
                                        alt={`thumb-${idx}`}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 메인 디테일 */}
                <div>
                    <img className="min-w-[491px] h-[654.58px] object-cover" src='src/assets/배너1.jpg' />
                </div>
            </div>

            {/* 제품 선택 */}
            <div>

            </div>
        </div>
    )
}
