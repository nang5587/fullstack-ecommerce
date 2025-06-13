
export default function TailInput({label, type}) {
    return (
        <div>
            <label htmlFor={type} className="block text-sm/6 font-bold text-gray-700">
                {label}
            </label>
            <div className="mt-2">
                <input
                    // ref={emailref}
                    id={type}
                    name={type}
                    type={type}
                    required
                    autoComplete={type}
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 
                    outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 
                    focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6 focus:bg-white"/>
            </div>
        </div>
    )
}
