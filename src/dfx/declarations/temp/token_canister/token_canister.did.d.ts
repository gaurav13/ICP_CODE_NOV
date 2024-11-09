import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';

export interface Account {
  'owner' : Principal,
  'subaccount' : [] | [SubAccount],
}
export interface Allowance {
  'allowance' : bigint,
  'expires_at' : [] | [bigint],
}
export type ApproveError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'AllowanceChanged' : { 'current_allowance' : bigint } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'Expired' : { 'ledger_time' : bigint } } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type Burners = Array<[string, TokenBurn]>;
export type Id = Principal;
export interface Ledger {
  'add_allounce_by_admin' : ActorMethod<
    [{ 'amount' : bigint, 'expires_at' : [] | [bigint], 'spender' : Account }],
    Result_1
  >,
  'burn_tokens' : ActorMethod<[Tokens, string], boolean>,
  'getAllBurners' : ActorMethod<
    [{ 'userId' : [] | [Id], 'page' : bigint, 'limit' : bigint }],
    { 'total' : bigint, 'burners' : Burners }
  >,
  'getAllMinters' : ActorMethod<
    [{ 'userId' : [] | [Id], 'page' : bigint, 'limit' : bigint }],
    { 'total' : bigint, 'minters' : Minters }
  >,
  'icrc1_balance_of' : ActorMethod<[Account], Tokens>,
  'icrc1_decimals' : ActorMethod<[], number>,
  'icrc1_fee' : ActorMethod<[], bigint>,
  'icrc1_metadata' : ActorMethod<[], Array<[string, Value]>>,
  'icrc1_minting_account' : ActorMethod<[], [] | [Account]>,
  'icrc1_name' : ActorMethod<[], string>,
  'icrc1_supported_standards' : ActorMethod<
    [],
    Array<{ 'url' : string, 'name' : string }>
  >,
  'icrc1_symbol' : ActorMethod<[], string>,
  'icrc1_total_supply' : ActorMethod<[], Tokens>,
  'icrc1_transfer' : ActorMethod<
    [
      {
        'to' : Account,
        'fee' : [] | [Tokens],
        'memo' : [] | [Memo],
        'from_subaccount' : [] | [Subaccount],
        'created_at_time' : [] | [Timestamp],
        'amount' : Tokens,
      },
    ],
    Result_2
  >,
  'icrc2_allowance' : ActorMethod<
    [{ 'account' : Account, 'spender' : Account }],
    Allowance
  >,
  'icrc2_approve' : ActorMethod<
    [
      {
        'fee' : [] | [Tokens],
        'memo' : [] | [Memo],
        'from_subaccount' : [] | [Subaccount],
        'created_at_time' : [] | [Timestamp],
        'amount' : bigint,
        'expected_allowance' : [] | [bigint],
        'expires_at' : [] | [bigint],
        'spender' : Account,
      },
    ],
    Result_1
  >,
  'icrc2_transfer_from' : ActorMethod<
    [
      {
        'to' : Account,
        'fee' : [] | [Tokens],
        'spender_subaccount' : [] | [Subaccount],
        'from' : Account,
        'memo' : [] | [Memo],
        'created_at_time' : [] | [Timestamp],
        'amount' : Tokens,
      },
    ],
    Result
  >,
  'mint_tokens' : ActorMethod<[Tokens, string], boolean>,
  'users_balance' : ActorMethod<[Array<string>], Array<[string, bigint]>>,
}
export type Memo = Uint8Array | number[];
export type Minters = Array<[string, TokenMinter]>;
export type Result = { 'Ok' : TxIndex } |
  { 'Err' : TransferFromError };
export type Result_1 = { 'Ok' : TxIndex } |
  { 'Err' : ApproveError };
export type Result_2 = { 'Ok' : TxIndex } |
  { 'Err' : TransferError };
export type SubAccount = Uint8Array | number[];
export type Subaccount = Uint8Array | number[];
export type Timestamp = bigint;
export interface TokenBurn {
  'creation_time' : bigint,
  'name' : string,
  'user' : Principal,
  'tokens' : bigint,
}
export interface TokenMinter {
  'creation_time' : bigint,
  'name' : string,
  'user' : Principal,
  'tokens' : bigint,
  'wallet' : Principal,
}
export type Tokens = bigint;
export type TransferError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'BadBurn' : { 'min_burn_amount' : Tokens } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TransferFromError = {
    'GenericError' : { 'message' : string, 'error_code' : bigint }
  } |
  { 'TemporarilyUnavailable' : null } |
  { 'InsufficientAllowance' : { 'allowance' : bigint } } |
  { 'BadBurn' : { 'min_burn_amount' : Tokens } } |
  { 'Duplicate' : { 'duplicate_of' : TxIndex } } |
  { 'BadFee' : { 'expected_fee' : Tokens } } |
  { 'CreatedInFuture' : { 'ledger_time' : Timestamp } } |
  { 'TooOld' : null } |
  { 'InsufficientFunds' : { 'balance' : Tokens } };
export type TxIndex = bigint;
export type Value = { 'Int' : bigint } |
  { 'Nat' : bigint } |
  { 'Blob' : Uint8Array | number[] } |
  { 'Text' : string };
export interface _SERVICE extends Ledger {}
