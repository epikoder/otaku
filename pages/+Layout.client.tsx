import { Fragment, ReactNode, useEffect, useRef, useState } from "react";
import logoUrl from "../assets/logo.svg";
import { Alert, ChartLog, ClockForward, MessageAdd } from "@components/Icons";
import useSelectedAccount from "@hooks/useSelectedAccount";
import ContactProvider from "../providers/contact.provider.client";
import { WalletProvider } from "@solana/wallet-adapter-react";
import {
    PhantomWalletAdapter,
    TrustWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import WalletConnect from "@components/WallectConnect";
import { startNewChat } from "../providers/chat.provider.client";
import DataStoreProvider from "../providers/datastore.provider.client";
import JournalLog from "@components/JournalLog";

export default function ({ children }: { children: ReactNode }) {
    return (
        <WalletProvider
            wallets={[
                new PhantomWalletAdapter(),
                new TrustWalletAdapter(),
            ]}
        >
            <DataStoreProvider>
                <ContactProvider>
                    <div className="max-w-screen-xl w-full p-4 mx-auto flex flex-col gap-3">
                        <nav className="flex justify-between items-center">
                            <a href="/">
                                <img src={logoUrl} className="max-h-14" />
                            </a>
                            <div className="flex gap-4 items-center">
                                <WalletConnect />
                                <Nav />
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
                </ContactProvider>
            </DataStoreProvider>
        </WalletProvider>
    );
}

const NewChat = () => {
    return (
        <button onClick={startNewChat} className="flex items-center gap-4">
            <MessageAdd className="bg-[#303030] p-1 size-8 rounded-md" />
            <span className="md:hidden">
                New chat
            </span>
        </button>
    );
};

const ChatHistory = () => {
    const account = useSelectedAccount();
    return (
        <>
            {account && (
                <button className="flex items-center gap-4">
                    <ClockForward className="bg-[#303030] p-1 size-8 rounded-md" />
                    <span className="md:hidden">
                        Chat history
                    </span>
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
                <Fragment>
                    <button className="md:flex items-center gap-4 hidden">
                        <ChartLog className="bg-[#303030] p-1 size-8 rounded-md" />
                        <span className="md:hidden">
                            New chat
                        </span>
                    </button>
                    <div className="border-t border-zinc-200 w-full">
                        <JournalLog/>
                    </div>
                </Fragment>
            )}
        </>
    );
};

const Nav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    return (
        <Fragment>
            <button
                className="md:hidden"
                onClick={(ev) => setIsOpen(true)}
            >
                Menu
            </button>
            <div
                ref={ref}
                className={`z-40 absolute inset-0 bg-transparent ${
                    !isOpen ? "hidden" : ""
                }`}
                onClick={(ev) => {
                    ev.preventDefault();
                    ev.stopPropagation();
                    setIsOpen(false);
                }}
            />
            <div
                id={"nav-menu"}
                className={`${isOpen ? "active" : ""}`}
            >
                <NewChat />
                <ChatHistory />
                <TradeLog />
            </div>
        </Fragment>
    );
};
