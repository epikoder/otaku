import { useWallet } from "@solana/wallet-adapter-react";

export default function useSelectedAccount() {
    const { publicKey } = useWallet();
    return publicKey;
}
