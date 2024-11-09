import { Principal } from '@dfinity/principal';

interface Auth {
  state: string;
  actor: Actor | null;
  client: AuthClient | null;
  isLoading: boolean;
  connectedWithWeb2: boolean;
}
export interface UserPermissions {
  userManagement: boolean;
  articleManagement: boolean;
  adminManagement: boolean;
}

interface UserAuth {
  name: string;
  status: boolean;
  role: string;
  principalText: string;
  principalArray: null | Principal;
  userPerms: null | UserPermissions;
  isAdminBlocked: Boolean;
}
export interface Wallet {
  balance: number;
  reward: number;
}
export interface ConnectStore {
  identity: any;
  principal: string;
  tokenSymbol: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  tokensBalance: number;
  reward: number;
  setIdentity: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setTokensBalance: (input: number) => void;
  setPrincipal: (input: string) => void;
  setTokenSymbol: (input: string) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
}

export interface ConnectPlugWalletSlice {
  identity: any;
  principal: string;
  tokenSymbol: string;
  auth: Auth;
  userAuth: UserAuth;
  balance: number;
  tokensBalance: number;
  reward: number;
  emailConnected: boolean;
  setIdentity: (input: any) => void;
  setEmailConnected: (input: boolean) => void;
  setPrincipal: (input: string) => void;
  setTokenSymbol: (input: string) => void;
  setReward: (input: number) => void;
  setBalance: (input: number) => void;
  setTokensBalance: (input: number) => void;
  setAuth: (input: Auth) => void;
  setUserAuth: (input: UserAuth) => void;
}
