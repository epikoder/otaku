import { useWeb3React } from "@web3-react/core";

export default function useSelectedAccount() {
    const { connector, hooks } = useWeb3React();
    return hooks.useSelectedAccount(connector);
}
