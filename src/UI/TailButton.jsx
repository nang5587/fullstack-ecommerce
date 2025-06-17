
export default function TailButton({ children, color, onClick, disabled }) {
    const bg = {
        "black": "bg-black text-white font-bold",
        "black2": "bg-black text-white font-bold",
        "white": "bg-white text-gray-600 font-bold border border-gray-300",
        "ash": "bg-kalani-ash text-kalani-creme font-bold",
        "google": "bg-white text-kalani-ash font-bold border border-kalani-stone",
        "selGhost": "bg-white text-kalani-ash font-bold border border-gray-200",
        "naver": "bg-[#03C75A] text-white font-bold",
        "ghost": "bg-transparent border border-kalani-ash text-kalani-ash",
        "mist": "bg-kalani-mist text-kalani-ash font-bold border border-kalani-ash",
        "navy": "bg-kalani-navy text-white font-bold",
    }
    const bgHover = {
        "black": "hover:bg-blue-500 text-white",
        "black2": "hover:bg-gray-700 text-white",
        "ash": "hover:opacity-90",
        "google": "hover:bg-gray-200",
        "selGhost": "hover:bg-gray-200",
        "naver": "hover:opacity-90",
        "ghost": "hover:bg-gray-200",
        "navy": "hover:opacity-80",
    }
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`
                    w-full p-3 text-base
                    flex justify-center items-center gap-3
                    transition-all duration-200 rounded-md
                    ${bgHover[color]}
                    ${bg[color]} 
                    ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {children}
        </button>
    )
}
