import { Fragment, ReactNode, useRef } from "react";

import logoUrl from "../assets/logo.svg";
import Button from "@components/Button";
import { Alert, ClockForward, MessageAdd } from "@components/Icons";
import WalletConnect from "@components/WallectConnect";
export default function ({ children }: { children: ReactNode }) {
    return (
        <div className="max-w-screen-xl w-full p-4 mx-auto flex flex-col gap-3">
            <nav className="flex justify-between items-center">
                <a href="/">
                    <img src={logoUrl} className="max-h-14" />
                </a>
                <div className="flex gap-4 items-center">
                    <WalletConnect />
                    <MessageAdd className="bg-[#303030] p-1 size-8 rounded-md" />
                    <ClockForward className="bg-[#303030] p-1 size-8 rounded-md" />
                </div>
            </nav>
            <Fragment>
                {children}
            </Fragment>
            <footer className="h-12 flex gap-3 items-center justify-center text-xs">
                <Alert />
                <p className="text-[#A1A1A1]">
                    Otaku’s Sensei could sometimes make misprediction and
                    errors, please check important info qnd do proper research.
                </p>
            </footer>
        </div>
    );
}
