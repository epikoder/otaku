import { useWeb3React } from "@web3-react/core";

export default function useSelectedProvider() {
    const { connector, hooks } = useWeb3React();
    return hooks.useSelectedProvider(connector);
}
