import {
    DynamicContextProvider,
    DynamicWidget,
} from "@dynamic-labs/sdk-react-core";
import { SolanaWalletConnectors } from "@dynamic-labs/solana";
import { Fragment } from "react/jsx-runtime";
import Button from "./Button";
import { useRef } from "react";

export default function WalletConnect() {
    const ref = useRef<HTMLDivElement>(null);
    return (
        <Fragment>
            <DynamicContextProvider
                settings={{
                    environmentId: "28398f7d-8b43-484a-a205-007cbc884fdd",
                    walletConnectors: [
                        SolanaWalletConnectors,
                    ],
                }}
            >
                
                <div  ref={ref}>
                    <DynamicWidget />
                </div>
            </DynamicContextProvider>
        </Fragment>
    );
}
