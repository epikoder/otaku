import { createContext, ReactNode, useEffect, useState } from "react";

export const __ContactContext__ = createContext<{ contact: Record<string, string> }>({
    contact: {},
});

export default function ContactProvider({ children }: { children: ReactNode }) {
    const [contact, setContact] = useState<Record<string, string>>({});

    useEffect(() => {
        const c = localStorage.getItem("contact");
        if (c) {
            try {
                const __c = JSON.parse(c);
                setContact(__c);
            } catch (error) {
            }
        }
    }, []);

    return (
        <__ContactContext__.Provider value={{ contact }}>
            {children}
        </__ContactContext__.Provider>
    );
}
