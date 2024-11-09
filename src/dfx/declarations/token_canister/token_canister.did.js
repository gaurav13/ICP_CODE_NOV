export const idlFactory = ({ IDL }) => {
  const SubAccount = IDL.Vec(IDL.Nat8);
  const Account = IDL.Record({
    'owner' : IDL.Principal,
    'subaccount' : IDL.Opt(SubAccount),
  });
  const TxIndex = IDL.Nat;
  const Tokens = IDL.Nat;
  const Timestamp = IDL.Nat64;
  const ApproveError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'AllowanceChanged' : IDL.Record({ 'current_allowance' : IDL.Nat }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'Expired' : IDL.Record({ 'ledger_time' : IDL.Nat64 }),
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result_1 = IDL.Variant({ 'Ok' : TxIndex, 'Err' : ApproveError });
  const Id = IDL.Principal;
  const TokenBurn = IDL.Record({
    'creation_time' : IDL.Int,
    'name' : IDL.Text,
    'user' : IDL.Principal,
    'tokens' : IDL.Nat,
  });
  const Burners = IDL.Vec(IDL.Tuple(IDL.Text, TokenBurn));
  const TokenMinter = IDL.Record({
    'creation_time' : IDL.Int,
    'name' : IDL.Text,
    'user' : IDL.Principal,
    'tokens' : IDL.Nat,
    'wallet' : IDL.Principal,
  });
  const Minters = IDL.Vec(IDL.Tuple(IDL.Text, TokenMinter));
  const Value = IDL.Variant({
    'Int' : IDL.Int,
    'Nat' : IDL.Nat,
    'Blob' : IDL.Vec(IDL.Nat8),
    'Text' : IDL.Text,
  });
  const Memo = IDL.Vec(IDL.Nat8);
  const Subaccount = IDL.Vec(IDL.Nat8);
  const TransferError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Tokens }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result_2 = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferError });
  const Allowance = IDL.Record({
    'allowance' : IDL.Nat,
    'expires_at' : IDL.Opt(IDL.Nat64),
  });
  const TransferFromError = IDL.Variant({
    'GenericError' : IDL.Record({
      'message' : IDL.Text,
      'error_code' : IDL.Nat,
    }),
    'TemporarilyUnavailable' : IDL.Null,
    'InsufficientAllowance' : IDL.Record({ 'allowance' : IDL.Nat }),
    'BadBurn' : IDL.Record({ 'min_burn_amount' : Tokens }),
    'Duplicate' : IDL.Record({ 'duplicate_of' : TxIndex }),
    'BadFee' : IDL.Record({ 'expected_fee' : Tokens }),
    'CreatedInFuture' : IDL.Record({ 'ledger_time' : Timestamp }),
    'TooOld' : IDL.Null,
    'InsufficientFunds' : IDL.Record({ 'balance' : Tokens }),
  });
  const Result = IDL.Variant({ 'Ok' : TxIndex, 'Err' : TransferFromError });
  const Ledger = IDL.Service({
    'add_allounce_by_admin' : IDL.Func(
        [
          IDL.Record({
            'amount' : IDL.Nat,
            'expires_at' : IDL.Opt(IDL.Nat64),
            'spender' : Account,
          }),
        ],
        [Result_1],
        [],
      ),
    'burn_tokens' : IDL.Func([Tokens, IDL.Text], [IDL.Bool], []),
    'getAllBurners' : IDL.Func(
        [
          IDL.Record({
            'userId' : IDL.Opt(Id),
            'page' : IDL.Nat,
            'limit' : IDL.Nat,
          }),
        ],
        [IDL.Record({ 'total' : IDL.Nat, 'burners' : Burners })],
        ['query'],
      ),
    'getAllMinters' : IDL.Func(
        [
          IDL.Record({
            'userId' : IDL.Opt(Id),
            'page' : IDL.Nat,
            'limit' : IDL.Nat,
          }),
        ],
        [IDL.Record({ 'total' : IDL.Nat, 'minters' : Minters })],
        ['query'],
      ),
    'icrc1_balance_of' : IDL.Func([Account], [Tokens], ['query']),
    'icrc1_decimals' : IDL.Func([], [IDL.Nat8], ['query']),
    'icrc1_fee' : IDL.Func([], [IDL.Nat], ['query']),
    'icrc1_metadata' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, Value))],
        ['query'],
      ),
    'icrc1_minting_account' : IDL.Func([], [IDL.Opt(Account)], ['query']),
    'icrc1_name' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_supported_standards' : IDL.Func(
        [],
        [IDL.Vec(IDL.Record({ 'url' : IDL.Text, 'name' : IDL.Text }))],
        ['query'],
      ),
    'icrc1_symbol' : IDL.Func([], [IDL.Text], ['query']),
    'icrc1_total_supply' : IDL.Func([], [Tokens], ['query']),
    'icrc1_transfer' : IDL.Func(
        [
          IDL.Record({
            'to' : Account,
            'fee' : IDL.Opt(Tokens),
            'memo' : IDL.Opt(Memo),
            'from_subaccount' : IDL.Opt(Subaccount),
            'created_at_time' : IDL.Opt(Timestamp),
            'amount' : Tokens,
          }),
        ],
        [Result_2],
        [],
      ),
    'icrc2_allowance' : IDL.Func(
        [IDL.Record({ 'account' : Account, 'spender' : Account })],
        [Allowance],
        ['query'],
      ),
    'icrc2_approve' : IDL.Func(
        [
          IDL.Record({
            'fee' : IDL.Opt(Tokens),
            'memo' : IDL.Opt(Memo),
            'from_subaccount' : IDL.Opt(Subaccount),
            'created_at_time' : IDL.Opt(Timestamp),
            'amount' : IDL.Nat,
            'expected_allowance' : IDL.Opt(IDL.Nat),
            'expires_at' : IDL.Opt(IDL.Nat64),
            'spender' : Account,
          }),
        ],
        [Result_1],
        [],
      ),
    'icrc2_transfer_from' : IDL.Func(
        [
          IDL.Record({
            'to' : Account,
            'fee' : IDL.Opt(Tokens),
            'spender_subaccount' : IDL.Opt(Subaccount),
            'from' : Account,
            'memo' : IDL.Opt(Memo),
            'created_at_time' : IDL.Opt(Timestamp),
            'amount' : Tokens,
          }),
        ],
        [Result],
        [],
      ),
    'mint_tokens' : IDL.Func([Tokens, IDL.Text], [IDL.Bool], []),
    'users_balance' : IDL.Func(
        [IDL.Vec(IDL.Text)],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
        ['query'],
      ),
  });
  return Ledger;
};
export const init = ({ IDL }) => {
  return [
    IDL.Record({
      'decimals' : IDL.Nat8,
      'token_symbol' : IDL.Text,
      'transfer_fee' : IDL.Nat,
      'minting_account' : IDL.Record({
        'owner' : IDL.Principal,
        'subaccount' : IDL.Opt(IDL.Vec(IDL.Nat8)),
        'amount' : IDL.Nat,
      }),
      'token_name' : IDL.Text,
    }),
  ];
};