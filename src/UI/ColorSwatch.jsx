export default function ColorSwatch({ colorCode, label, selected }) {
    return (
        <div className="flex items-center gap-2">
            <div
                className={`
                    w-[30px] h-[30px] rounded-full border 
                    ${selected ? 'border-gray-800' : 'border-gray-300'}
                `}
                style={{ backgroundColor: colorCode }}
            />
        </div>
    );
}
