export function MessageAdd(
    { ...props }: React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            width="36"
            height="37"
            viewBox="0 0 36 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            className="size-5"
            {...props}
        >
            <path
                d="M18 18.4505V14.8505M18 14.8505V11.2505M18 14.8505H14.4M18 14.8505H21.6M17.5304 25.3375L10.0174 32.8505V25.3375H7.20001C5.21178 25.3375 3.60001 23.7257 3.60001 21.7375V7.65054C3.60001 5.66231 5.21178 4.05054 7.20001 4.05054H28.8C30.7882 4.05054 32.4 5.66231 32.4 7.65054V21.7375C32.4 23.7257 30.7882 25.3375 28.8 25.3375H17.5304Z"
                stroke="#ADADAD"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ClockForward(
    { ...props }: React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            width="36"
            height="37"
            viewBox="0 0 36 37"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            className="size-5"
            {...props}
        >
            <path
                d="M21.9375 21.8255L16.875 20.138V13.0818M30.375 18.4505C30.375 10.9947 24.3308 4.95053 16.875 4.95053C9.41916 4.95053 3.375 10.9947 3.375 18.4505C3.375 25.9064 9.41916 31.9505 16.875 31.9505C21.8719 31.9505 26.2347 29.2357 28.5689 25.2005M26.6716 16.969L30.0466 20.344L33.4216 16.969"
                stroke="#ADADAD"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Alert(
    { ...props }: React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            width="21"
            height="20"
            viewBox="0 0 21 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            className="size-5"
            {...props}
        >
            <path
                d="M10.5 10V5.5M10.5 13.3354V13.375M19.5 10C19.5 14.9706 15.4706 19 10.5 19C5.52944 19 1.5 14.9706 1.5 10C1.5 5.02944 5.52944 1 10.5 1C15.4706 1 19.5 5.02944 19.5 10Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function Microphone(
    { ...props }: React.SVGProps<SVGSVGElement>,
) {
    return (
        <svg
            width="22"
            height="22"
            viewBox="0 0 22 22"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            stroke="currentColor"
            className="size-5"
            {...props}
        >
            <path
                d="M1.49298 12.3765C1.82542 14.6607 2.96914 16.7488 4.7149 18.2589C6.46066 19.7689 8.69174 20.6 11 20.6C13.3082 20.6 15.5393 19.7689 17.2851 18.2589C19.0308 16.7488 20.1746 14.6607 20.507 12.3765M11.0014 1.39999C9.90968 1.39999 8.86271 1.83366 8.09078 2.6056C7.31884 3.37753 6.88518 4.4245 6.88518 5.51617V11.0044C6.88518 12.0961 7.31884 13.1431 8.09078 13.915C8.86271 14.6869 9.90968 15.1206 11.0014 15.1206C12.093 15.1206 13.14 14.6869 13.9119 13.915C14.6839 13.1431 15.1175 12.0961 15.1175 11.0044V5.51617C15.1175 4.4245 14.6839 3.37753 13.9119 2.6056C13.14 1.83366 12.093 1.39999 11.0014 1.39999Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

export function ActivityIndicator(
    { className, active, ...props }: React.SVGProps<SVGSVGElement> & {
        active?: boolean;
    },
) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            {...props}
            className={`${"size-5" ?? className} ${
                active ? "animate-spin" : ""
            }`}
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
            />
        </svg>
    );
}
