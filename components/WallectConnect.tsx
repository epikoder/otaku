import { useCallback, useEffect, useState } from "react";

import { showDialog } from "./Dialog";
import { Wallet } from "@solana/wallet-adapter-react";
import { WalletName, WalletReadyState } from "@solana/wallet-adapter-base";
import { useWalletMultiButton } from "@solana/wallet-adapter-base-ui";
import {
    ArrowLeftStartOnRectangleIcon,
    XMarkIcon,
} from "@heroicons/react/16/solid";

export default function WalletConnect() {
    const [walletModalConfig, setWalletModalConfig] = useState<
        Readonly<{
            onSelectWallet(walletName: WalletName): void;
            wallets: Wallet[];
        }> | null
    >(null);

    const {
        buttonState,
        onConnect,
        onDisconnect,
        onSelectWallet,
        walletIcon,
        publicKey,
    } = useWalletMultiButton({
        onSelectWallet: setWalletModalConfig,
    });

    let label;
    switch (buttonState) {
        case "connected":
            label = publicKey!.toString().slice(0, 13).concat("...").concat(
                publicKey!.toString().slice(-3),
            );
            break;
        case "connecting":
            label = "Connecting";
            break;
        case "disconnecting":
            label = "Disconnecting";
            break;
        case "has-wallet":
            label = "Connect Wallet";
            break;
        case "no-wallet":
            label = "Select Wallet";
            break;
    }

    const handleClick = useCallback(() => {
        switch (buttonState) {
            case "connected":
                return () =>
                    showDialog(
                        ({ closeFn }) => (
                            <div className="w-full max-w-sm text-white flex flex-col gap-8">
                                <div className="p-4 flex flex-col gap-4">
                                    <button
                                        className="rounded-full p-2 text-zinc-200 bg-[#303030] w-fit ml-auto"
                                        onClick={() => {
                                            closeFn();
                                        }}
                                    >
                                        <XMarkIcon className="size-6" />
                                    </button>
                                    <div className="text-2xl text-center px-12">
                                        {publicKey!.toString().slice(0, 13)
                                            .concat("...").concat(
                                                publicKey!.toString().slice(-3),
                                            )}
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        className="flex justify-center items-center gap-4 px-6 hover:bg-[#303030] py-3 transition-all duration-200 text-red-500 text-sm uppercase font-semibold"
                                        onClick={() => {
                                            onDisconnect && onDisconnect();
                                            closeFn();
                                        }}
                                    >
                                        <span>
                                            Logout
                                        </span>
                                        <ArrowLeftStartOnRectangleIcon className="size-6" />
                                    </button>
                                </div>
                            </div>
                        ),
                        false,
                    );
            case "connecting":
            case "disconnecting":
                break;
            case "has-wallet":
                return onConnect;
            case "no-wallet":
                return onSelectWallet;
        }
    }, [buttonState, onDisconnect, onConnect, onSelectWallet])();

    return (
        <>
            <button
                disabled={buttonState === "connecting" ||
                    buttonState === "disconnecting"}
                onClick={handleClick}
                className={`w-fit flex items-center gap-3 ${
                    buttonState == "connected" ? "bg-[#303030]" : "bg-[#F11313]"
                } rounded-lg px-4 py-2 text-sm text-white font-semibold`}
            >
                <span>
                    {label}
                </span>
                {(walletIcon && buttonState == "has-wallet") && (
                    <img
                        src={walletIcon}
                        alt={walletIcon}
                        className="size-6"
                    />
                )}
            </button>
            {walletModalConfig &&
                (
                    <WalletPicker
                        config={walletModalConfig}
                        updateConfig={setWalletModalConfig}
                    />
                )}
        </>
    );
}

const WalletPicker = ({ config, updateConfig }: {
    config: Readonly<{
        onSelectWallet(walletName: WalletName): void;
        wallets: Wallet[];
    }>;
    updateConfig: (
        cfg:
            | Readonly<{
                onSelectWallet(walletName: WalletName): void;
                wallets: Wallet[];
            }>
            | null,
    ) => void;
}) => {
    useEffect(() => {
        showDialog(
            ({ closeFn }) => (
                <div className="w-full max-w-sm text-white flex flex-col gap-8">
                    <div className="p-4 flex flex-col gap-4">
                        <button
                            className="rounded-full p-2 text-zinc-200 bg-[#303030] w-fit ml-auto"
                            onClick={() => {
                                closeFn();
                                updateConfig(null);
                            }}
                        >
                            <XMarkIcon className="size-6" />
                        </button>
                        <div className="text-2xl text-center px-12">
                            Connect a wallet on Solana to continue
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        {config.wallets.map((wallet) => (
                            <button
                                className="flex justify-between items-center px-6 hover:bg-[#303030] py-3 transition-all duration-200"
                                key={wallet.adapter.name}
                                onClick={() => {
                                    config.onSelectWallet(
                                        wallet.adapter.name,
                                    );
                                    updateConfig(null);
                                    closeFn();
                                }}
                            >
                                <div className="flex items-center gap-2 font-semibold">
                                    <img
                                        src={wallet.adapter.icon}
                                        className="size-6"
                                    />
                                    <span>
                                        {wallet.adapter.name}
                                    </span>
                                </div>
                                {wallet.readyState !==
                                        WalletReadyState.Loadable && (
                                    <span className="font-light text-zinc-300 text-sm">
                                        {wallet.adapter.readyState ==
                                                WalletReadyState.Installed
                                            ? "Detected"
                                            : wallet.adapter.readyState ==
                                                    WalletReadyState.NotDetected
                                            ? "Not detected"
                                            : "Unsupported"}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            ),
            false,
            "wallet-picker",
            () => updateConfig(null),
        );
    }, []);

    return undefined;
};
