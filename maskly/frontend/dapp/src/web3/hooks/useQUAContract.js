import { useMemo } from "react";
import { ethers } from "ethers";
import useWallet from "./useWallet";

const QUA_ABI = [
    "function balanceOf(address) view returns (uint256)",
    "function transfer(address, uint256) returns (bool)",
    "function getProposalCount() view returns (uint256)",
    "function getProposal(uint256) view returns (string, bool)"
];

const useQUAContract = () => {
    const { provider, account } = useWallet();
    const contractAddress = "0xYourQUAContractAddress"; // Replace with actual deployed address

    const contract = useMemo(() => {
        if (!provider || !account) return null;
        const signer = provider.getSigner();
        return new ethers.Contract(contractAddress, QUA_ABI, signer);
    }, [provider, account]);

    return contract;
};

export default useQUAContract;

