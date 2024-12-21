import { Fragment, ReactNode, useRef } from "react";

import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import logoUrl from "../assets/logo.svg";
import { Alert, ClockForward, MessageAdd } from "@components/Icons";
import connectors from "@utils/connectors";
import PhantomWallet from "@components/Phantom";

export default function ({ children }: { children: ReactNode }) {
    const connections: [Connector, Web3ReactHooks][] = connectors.map((
        [connector, hooks],
    ) => [connector, hooks]);

    return (
        <Web3ReactProvider connectors={connections}>
            <div className="max-w-screen-xl w-full p-4 mx-auto flex flex-col gap-3">
                <nav className="flex justify-between items-center">
                    <a href="/">
                        <img src={logoUrl} className="max-h-14" />
                    </a>
                    <div className="flex gap-4 items-center">
                        <PhantomWallet />
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
                        errors, please check important info qnd do proper
                        research.
                    </p>
                </footer>
            </div>
        </Web3ReactProvider>
    );
}
