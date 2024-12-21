import { Fragment, useEffect, useState } from "react";
import { Web3ReactSelectedHooks } from "@web3-react/core";
import { Connector } from "@web3-react/types";
import { ActivityIndicator } from "./Icons";
import Toast from "@utils/toast";

export default function WalletConnect(
    { connector, hooks, name }: {
        connector: Connector;
        hooks: Web3ReactSelectedHooks;
        name: string;
    },
) {
    const {
        useSelectedAccount,
        useSelectedChainId,
        useSelectedIsActive,
        useSelectedIsActivating,
    } = hooks;
    const isActivating = useSelectedIsActivating(connector);
    const isActive = useSelectedIsActive(connector);
    const account = useSelectedAccount(connector);
    const chain = useSelectedChainId(connector);

    const [connectionStatus, setConnectionStatus] = useState<
        "Connected" | "Connecting" | "Disconnected"
    >("Disconnected");

    const handleToggleConnect = async () => {
        if (!("solana" in window)) {
            return Toast.error("No Solana wallet found. install Phantom");
        }
        if (isActive) {
            if (connector?.deactivate) {
                void connector.deactivate();
            } else {
                void connector.resetState();
            }
        } else if (!isActivating) {
            setConnectionStatus("Connecting");
            Promise.resolve(connector.activate(1))
                .catch((e) => {
                    connector.resetState();
                    setConnectionStatus("Disconnected");
                });
        }
    };

    useEffect(() => {
        if (isActive) {
            setConnectionStatus("Connected");
        } else {
            setConnectionStatus("Disconnected");
        }
    }, [isActive]);

    return (
        <button
            onClick={handleToggleConnect}
            className="px-4 py-1.5 rounded-lg text-white w-52 overflow-ellipsis whitespace-nowrap line-clamp-1 transition-all duration-300"
            style={{
                backgroundColor: isActive ? "#303030" : "#F11313",
            }}
        >
            {isActive
                ? account!.slice(0, 15).concat("...").concat(
                    account!.slice(-3),
                )
                : (
                    <div className="flex gap-3 items-center justify-center">
                        <span>
                            Connect wallet
                        </span>
                        {connectionStatus == "Connecting" && (
                            <ActivityIndicator active />
                        )}
                    </div>
                )}
        </button>
    );
}
