import { toast } from "react-toastify";
import useContract from "./useContract";
import { useAppKitAccount } from "@reown/appkit/react";
import { useAppKitNetwork } from "@reown/appkit/react";
import { liskSepoliaNetwork } from "../connection";
import { useCallback } from "react";

export function useExecuteProposal(proposalId) {
  const contract = useContract(true);
  const { address } = useAppKitAccount();
  const { chainId } = useAppKitNetwork();

  const executeProposal = useCallback(async () => {
    try {
      if (!address) {
        toast.error("Connect your wallet!");
        return;
      }

      if (Number(chainId) !== liskSepoliaNetwork.chainId) {
        toast.error("You are not connected to the right network");
        return;
      }

      const proposalCount = Number(await contract.proposalCount());

      if (proposalId > proposalCount) {
        toast.error("Invalid proposal ID!");
        return;
      }

      const executeTx = await contract.executeProposal(proposalId);

      const receipt = await executeTx.wait();

      if (receipt.status === 1) {
        toast.success("Execution successful");
        return;
      }
      toast.error("Execution failed");
      return;
    } catch (error) {
      console.error(error);
      toast.error("Execution error!");
    }
  }, [address, chainId, contract, proposalId]);

  return { executeProposal };
}
