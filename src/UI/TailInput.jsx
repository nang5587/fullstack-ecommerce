import React from "react";

const TailInput = React.forwardRef(({ label, type, value, onChange , onKeyDown }, ref) => {
    return (
        <div>
            <label
                htmlFor={type}
                className="block text-sm font-medium text-kalani-taupe"
            >
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={type}
                    name={type}
                    type={type}
                    required
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    ref={ref}  // forwardRef 덕분에 여기 ref가 제대로 전달됨
                    autoComplete={type}
                    className="
                        block w-full rounded-lg border bg-transparent px-4 py-3
                        text-base text-kalani-ash placeholder:text-kalani-stone
                        border-kalani-stone 
                        focus:border-kalani-ash focus:ring-0
                        transition-colors duration-200 ease-in-out"
                />
            </div>
        </div>
    );
});

export default TailInput;
