import type React from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string,
    error?: boolean
    errorMessage?: string
}

export default function InputField({ label, error, errorMessage, ...props }: InputFieldProps) {
    return <div className="flex flex-col gap-2">
        <div className="relative w-full">
            <input
                {...props}
                className={`peer bg-white cursor-pointer hover:shadow-xl rounded-full px-6 py-5 text-sm outline-none 
      flex-1 border border-gray-400 focus:border-plum hover:border-plum transition-base w-full ${error && "border-rose-500 text-rose-700"}`}
            />
            {label && <span className={`pointer-events-none absolute left-0 ${props.value?.toString().length === 0 ? "top-0" : "-top-7 text-xs"} flex flex-col items-center justify-center h-full p-5 
    peer-focus:-top-7 transition-all duration-300 peer-focus:text-xs`}>
                <label className={`bg-white px-2 rounded ${error && "text-rose-700"} `}>{label}</label>
            </span>}
        </div>

        {errorMessage && error && <span className="text-rose-700 flex items-center gap-2 text-xs"> <i className="bi bi-exclamation-octagon"></i> <p> {errorMessage} </p> </span>}
    </div>
}