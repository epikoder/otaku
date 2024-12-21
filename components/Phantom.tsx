import { useWeb3React } from "@web3-react/core";
import WalletConnect from "./WallectConnect";

export default function PhantomWallet() {
    const { connector, hooks } = useWeb3React();
    
    return (
        <WalletConnect
            connector={connector}
            hooks={hooks}
            name="Phantom"
        />
    );
}
