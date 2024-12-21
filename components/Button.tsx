import { ButtonHTMLAttributes, ReactElement } from "react";

export default function Button(
    { icon, children, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & {
        icon?: ReactElement;
    },
) {
    return (
        <button
            {...props}
            style={{ ...props.style, backgroundColor: "#F11313" }}
        >
            {children}
        </button>
    );
}
