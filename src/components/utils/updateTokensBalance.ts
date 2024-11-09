import { E8S } from '@/constant/config';
import { makeLedgerCanister, makeTokenCanister } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Auth, ConnectPlugWalletSlice } from '@/types/store';
import { AccountIdentifier } from '@dfinity/ledger-icp';
import { create } from 'zustand';

interface Props {
  identity: any;
  auth: Auth;
  setTokensBalance: (input: number) => void;
}
export default function updateTokensBalance({ identity, auth, setTokensBalance }: Props) {
  const getBalance = async () => {
    if (auth.state !== 'initialized' || !identity) return;
    let tokenActor = await makeTokenCanister({
      agentOptions: {
        identity,
      },
    });

   
      let myPrincipal = identity.getPrincipal();
      let res = await tokenActor.icrc1_balance_of({
        owner: myPrincipal,
        subaccount: [],
      });
      let balance = parseInt(res);

     
    setTokensBalance(balance);
  };
  getBalance();
}
