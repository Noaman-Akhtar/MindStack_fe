import type { ReactNode } from "react";

interface ButtonProps { //things that the button component will contain 
    variant: "primary" | "secondary";
    size: "sm" | "md" | "lg"|"full";
    text: string;
    startIcon?: ReactNode;
    endIcon?: ReactNode;
    onClick?: () => void;
    loading?:boolean;
}
const variantStyles = { // different styles or commands for a specific prop 
    "primary": "bg-[#d4bbff] text-[#0F0F1A]",
    "secondary": "bg-[#2D2B55] text-[#C4C2FF]"
}
const sizeStyles = {
    "sm": "py-1 px-2",
    "md": "py-3 px-3",
    "lg": "p-6",
    "full":"w-full flex justify-center items-center h-12"
}

const defaultStyles = "rounded-md flex px-2"// //variantStyles[props.variant] + " " + defaultStyles + " " + sizeStyles[props.size] // Both will produce the same result as long as you remember to include the spaces in the concatenation version. The template literal version is generally preferred in modern JavaScript as it's cleaner and less error-prone.
export const Button = (props: ButtonProps) => {
    return (
        <button
            className={`
                ${variantStyles[props.variant]} ${defaultStyles} ${sizeStyles[props.size]}
                transition-transform hover:brightness-75  duration-200 hover:shadow-lg hover:-translate-y-1
                hover:cursor-pointer
            `}
            onClick={props.onClick}
            disabled={props.loading}
        >
            <div className="flex items-center gap-1.5 font-medium">
                {props.startIcon}{props.text}{props.endIcon}
            </div>
        </button>
    );
}