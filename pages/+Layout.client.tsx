import { Fragment, ReactNode } from "react";
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

export default function ({ children }: { children: ReactNode }) {
    return (
        <WalletProvider
            wallets={[
                new PhantomWalletAdapter(),
                new TrustWalletAdapter(),
            ]}
        >
            <ContactProvider>
                <div className="max-w-screen-xl w-full p-4 mx-auto flex flex-col gap-3">
                    <nav className="flex justify-between items-center">
                        <a href="/">
                            <img src={logoUrl} className="max-h-14" />
                        </a>
                        <div className="flex gap-4 items-center">
                            <WalletConnect />
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
                            Otaku’s Sensei could sometimes make misprediction
                            and errors, please check important info and do
                            proper research.
                        </p>
                    </footer>
                </div>
            </ContactProvider>
        </WalletProvider>
    );
}

const NewChat = () => {
    return (
        <button onClick={startNewChat}>
            <MessageAdd className="bg-[#303030] p-1 size-8 rounded-md" />
        </button>
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
