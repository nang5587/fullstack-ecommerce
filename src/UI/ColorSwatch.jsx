
export default function ColorSwatch({ colorCode, selected }) {

    return (
        <div className="w-full h-full flex flex-col items-center">
            <div
                className={`
                    w-4/5 aspect-square rounded-full  
                    ${selected ? 'border-2 border-gray-700' : ''}
                `}
                style={{ backgroundColor: colorCode }}
            />
        </div>
    );
}
