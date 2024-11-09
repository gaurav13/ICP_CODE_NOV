import { makeLedgerCanister, makeTokenCanister } from '../../dfx/service/actor-locator';
import { Auth, ConnectPlugWalletSlice } from '../../types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { create } from 'zustand';

interface Props {
  identity: any;
  auth: Auth;
  setTokenSymbol: (input: number) => void;
}
export default function updateTokenSymbol({ identity, auth, setTokenSymbol }: Props) {
  const getSymbol= async () => {
    if (auth.state !== 'initialized' || !identity) return;
    let tokenActor = await makeTokenCanister({
      agentOptions: {
        identity,
      },
    });

   
 
      let res = await tokenActor.icrc1_symbol();
      let balance = res;

     
      setTokenSymbol(balance);
  };
  getSymbol();
}
