import { Fragment, ReactNode, useRef } from "react";

import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import logoUrl from "../assets/logo.svg";
import { Alert, ChartLog, ClockForward, MessageAdd } from "@components/Icons";
import connectors from "@utils/connectors";
import PhantomWallet from "@components/Phantom";
import useSelectedAccount from "@hooks/useSelectedAccount";
import ChatProvider, {
    __ChatContext__,
} from "../providers/chat.provider.client";
import ContactProvider from "../providers/contact.provider.client";

export default function ({ children }: { children: ReactNode }) {
    const connections: [Connector, Web3ReactHooks][] = connectors.map((
        [connector, hooks],
    ) => [connector, hooks]);

    return (
        <Web3ReactProvider connectors={connections}>
            <ContactProvider>
                <ChatProvider>
                    <div className="max-w-screen-xl w-full p-4 mx-auto flex flex-col gap-3">
                        <nav className="flex justify-between items-center">
                            <a href="/">
                                <img src={logoUrl} className="max-h-14" />
                            </a>
                            <div className="flex gap-4 items-center">
                                <PhantomWallet />
                                <NewChat />
                                <ChatHistory />
                                <TradeLog />
                            </div>
                        </nav>
                        <Fragment>
                            {children}
                        </Fragment>
                        <footer className="h-12 flex gap-3 items-center justify-center text-xs">
                            <Alert />
                            <p className="text-[#A1A1A1]">
                                Otaku’s Sensei could sometimes make
                                misprediction and errors, please check important
                                info and do proper research.
                            </p>
                        </footer>
                    </div>
                </ChatProvider>
            </ContactProvider>
        </Web3ReactProvider>
    );
}

const NewChat = () => {
    return (
        <__ChatContext__.Consumer>
            {({ clearChat }) => (
                <button onClick={clearChat}>
                    <MessageAdd className="bg-[#303030] p-1 size-8 rounded-md" />
                </button>
            )}
        </__ChatContext__.Consumer>
    );
};

const ChatHistory = () => {
    const account = useSelectedAccount();
    return (
        <>
            {account && (
                <button>
                    <ClockForward className="bg-[#303030] p-1 size-8 rounded-md" />
                </button>
            )}
        </>
    );
};

const TradeLog = () => {
    const account = useSelectedAccount();
    return (
        <>
            {account && (
                <button>
                    <ChartLog className="bg-[#303030] p-1 size-8 rounded-md" />
                </button>
            )}
        </>
    );
};
