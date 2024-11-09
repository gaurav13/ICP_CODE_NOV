import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Principal "mo:base/Principal";
import Option "mo:base/Option";
import Error "mo:base/Error";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Nat8 "mo:base/Nat8";
import Nat64 "mo:base/Nat64";
import Map "mo:base/HashMap";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";
import Text "mo:base/Text";
import Order "mo:base/Order";
import Bool "mo:base/Bool";
import UserType "../model/UserType";
import EntryType "../model/EntryType";

shared ({ caller = initializer }) actor class Ledger(init : { minting_account : { owner : Principal; subaccount : ?Blob; amount : Nat }; token_name : Text; token_symbol : Text; decimals : Nat8; transfer_fee : Nat }) = this {

  public type Subaccount = Blob;
  public type Tokens = Nat;
  public type Memo = Blob;
  public type Timestamp = Nat64;
  public type Duration = Nat64;
  public type TxIndex = Nat;
  public type Id = Principal;
  type Permission = UserType.Permission;
  type TokenMinter = UserType.TokenMinter;
  type Minters = UserType.Minters;
  type Account = UserType.Account;
  type Burners = UserType.Burners;
  type TokenBurn = UserType.TokenBurn;

  public type Value = { #Nat : Nat; #Int : Int; #Blob : Blob; #Text : Text };

  let maxMemoSize = 32;
  let permittedDriftNanos : Duration = 60_000_000_000;
  let transactionWindowNanos : Duration = 24 * 60 * 60 * 1_000_000_000;
  let defaultSubaccount : Subaccount = Blob.fromArrayMut(Array.init(32, 0 : Nat8));
  public type AllowanceRecord = {
    allowance : Nat;
    expires_at : ?Nat64;
    to : Principal;
  };

  let MAX_TRANS_LIMIT = 10;
  public type Accounts = [(Id, Tokens)];

  public type UserAllownce = [(Id, [AllowanceRecord])];

  stable var totall_supply : Tokens = 0;

  stable var stable_accounts : Accounts = [];
  stable var stable_allownce : UserAllownce = [];
  stable var stable_token_minter : Minters = [];
  stable var stable_token_burn : Burners = [];

  var accountStorage = Map.fromIter<Id, Tokens>(stable_accounts.vals(), 0, Principal.equal, Principal.hash);
  var allownceStorage = Map.fromIter<Id, [AllowanceRecord]>(stable_allownce.vals(), 0, Principal.equal, Principal.hash);
  var minterStorage = Map.fromIter<Text, TokenMinter>(stable_token_minter.vals(), 0, Text.equal, Text.hash);
  var burnerStorage = Map.fromIter<Text, TokenBurn>(stable_token_burn.vals(), 0, Text.equal, Text.hash);

  public type Operation = {
    #Approve : Approve;
    #Transfer : Transfer;
    #Burn : Transfer;
    #Mint : Transfer;
  };

  public type CommonFields = {
    memo : ?Memo;
    fee : ?Tokens;
    created_at_time : ?Timestamp;
  };

  public type Approve = CommonFields and {
    from : Account;
    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;
  };

  public type TransferSource = {
    #Init;
    #Icrc1Transfer;
    #Icrc2TransferFrom;
  };

  public type Transfer = CommonFields and {
    spender : Account;
    source : TransferSource;
    to : Account;
    from : Account;
    amount : Tokens;
  };

  public type Allowance = { allowance : Nat; expires_at : ?Nat64 };

  public type Transaction = {
    operation : Operation;
    // Effective fee for this transaction.
    fee : Tokens;
    timestamp : Timestamp;
  };

  public type DeduplicationError = {
    #TooOld;
    #Duplicate : { duplicate_of : TxIndex };
    #CreatedInFuture : { ledger_time : Timestamp };
  };

  public type CommonError = {
    #InsufficientFunds : { balance : Tokens };
    #BadFee : { expected_fee : Tokens };
    #TemporarilyUnavailable;
    #GenericError : { error_code : Nat; message : Text };
  };

  public type TransferError = DeduplicationError or CommonError or {
    #BadBurn : { min_burn_amount : Tokens };
  };

  public type ApproveError = DeduplicationError or CommonError or {
    #Expired : { ledger_time : Nat64 };
    #AllowanceChanged : { current_allowance : Nat };
  };

  public type TransferFromError = TransferError or {
    #InsufficientAllowance : { allowance : Nat };
  };

  public type Result<T, E> = { #Ok : T; #Err : E };
  /*
getCurrentDate use to get current date in milisecons
@return date:Int date in milisecons
  */
  func getCurrentDate() : Int {
    return Time.now() / 1_000_000;
  };
  /*
getLimit use to  check limit provided by caller is must to be greater then max limit
@perms :Nat
@return Nat
  */
  func getLimit(limit : Nat) : Nat {
    var tempLimit = MAX_TRANS_LIMIT;
    if (limit < MAX_TRANS_LIMIT) tempLimit := limit;
    return tempLimit;
  };
  public shared ({ caller }) func icrc1_transfer({
    from_subaccount : ?Subaccount;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, TransferError> {

    var tempcaller = caller;
    let balance = accountStorage.get(tempcaller);
    if (amount <= 0) {
      return #Err(#InsufficientFunds { balance = amount });

    };
    switch (balance) {
      case (?isbalance) {
        if (isbalance <= 0) {
          return #Err(#InsufficientFunds { balance = isbalance });

        };

        if (amount <= isbalance) {
          let tempReceiverBalance = accountStorage.get(to.owner);
          let senderNewBalance = isbalance -amount;
          switch (tempReceiverBalance) {
            case (?isReceiver) {

              let receiverNewBalance = isReceiver +amount;
              let tempReceiverBalance = accountStorage.replace(to.owner, receiverNewBalance);

              let tempSenderBalance = accountStorage.replace(tempcaller, senderNewBalance);

              return #Ok(0);

            };
            case (null) {

              let tempReceiverBalance = accountStorage.put(to.owner, amount);
              let tempSenderBalance = accountStorage.replace(tempcaller, senderNewBalance);
              return #Ok(0);

            };
          };

        } else {
          return #Err(#InsufficientFunds { balance = isbalance });
        };

      };
      case (null) {
        return #Err(#InsufficientFunds { balance = 0 });
      };
    };
  };

  public query func icrc1_balance_of(account : Account) : async Tokens {
    checkBalance(account.owner);
  };
  public query func users_balance(accounts : [Text]) : async [(Text, Nat)] {
    assert accounts.size() <= 20;
    var usersList = Map.HashMap<Text, Nat>(0, Text.equal, Text.hash);

    for (id in accounts.vals()) {
      let userId = Principal.fromText(id);
      let balance = checkBalance(userId);
      usersList.put(id, balance);
    };
    return Iter.toArray(usersList.entries());
  };
  public query func icrc1_total_supply() : async Tokens {
    totall_supply;
  };

  public query func icrc1_minting_account() : async ?Account {
    ?init.minting_account;
  };

  public query func icrc1_name() : async Text {
    init.token_name;
  };

  public query func icrc1_symbol() : async Text {
    init.token_symbol;
  };

  public query func icrc1_decimals() : async Nat8 {
    init.decimals;
  };

  public query func icrc1_fee() : async Nat {
    init.transfer_fee;
  };

  public query func icrc1_metadata() : async [(Text, Value)] {
    [
      ("icrc1:name", #Text(init.token_name)),
      ("icrc1:symbol", #Text(init.token_symbol)),
      ("icrc1:decimals", #Nat(Nat8.toNat(init.decimals))),
      ("icrc1:fee", #Nat(init.transfer_fee)),
    ];
  };

  public query func icrc1_supported_standards() : async [{
    name : Text;
    url : Text;
  }] {
    [
      {
        name = "ICRC-1";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-1";
      },
      {
        name = "ICRC-2";
        url = "https://github.com/dfinity/ICRC-1/tree/main/standards/ICRC-2";
      },
    ];
  };

  public shared ({ caller }) func icrc2_approve({
    from_subaccount : ?Subaccount;
    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;
    expected_allowance : ?Nat;
    memo : ?Memo;
    fee : ?Tokens;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, ApproveError> {
    var tempcaller = caller;

    let tempAllownce : AllowanceRecord = {
      to = spender.owner;
      allowance = amount;
      expires_at = expires_at;
    };
    let allownce = allownceStorage.get(tempcaller);
    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == spender.owner);
        switch (isAlready) {
          case (?isAlready) {

            var filtered = Array.filter<AllowanceRecord>(isAllownce, func x = x.to != spender.owner);
            var newArray = Array.append<AllowanceRecord>(filtered, [tempAllownce]);
            let added = allownceStorage.put(tempcaller, newArray);
            return #Ok(amount);

          };
          case (null) {
            var newArray = Array.append<AllowanceRecord>(isAllownce, [tempAllownce]);
            let added = allownceStorage.put(tempcaller, newArray);
            return #Ok(amount);

          };
        };

      };
      case (null) {
        let tempArray = [tempAllownce];
        let added = allownceStorage.put(tempcaller, tempArray);
        return #Ok(amount);

      };
    };

  };
   public shared ({ caller }) func add_allounce_by_admin({

    spender : Account;
    amount : Nat;
    expires_at : ?Nat64;

  }) : async Result<TxIndex, ApproveError> {
      assert Principal.isController(caller);

    var tempcaller = init.minting_account.owner;

    let tempAllownce : AllowanceRecord = {
      to = spender.owner;
      allowance = amount;
      expires_at = expires_at;
    };
    let allownce = allownceStorage.get(tempcaller);
    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == spender.owner);
        switch (isAlready) {
          case (?isAlready) {

            var filtered = Array.filter<AllowanceRecord>(isAllownce, func x = x.to != spender.owner);
            var newArray = Array.append<AllowanceRecord>(filtered, [tempAllownce]);
            let added = allownceStorage.put(tempcaller, newArray);
            return #Ok(amount);

          };
          case (null) {
            var newArray = Array.append<AllowanceRecord>(isAllownce, [tempAllownce]);
            let added = allownceStorage.put(tempcaller, newArray);
            return #Ok(amount);

          };
        };

      };
      case (null) {
        let tempArray = [tempAllownce];
        let added = allownceStorage.put(tempcaller, tempArray);
        return #Ok(amount);

      };
    };

  };
  func getAllowence(
    from : Id,
    to : Id,
  ) : Tokens {
    let allownce = allownceStorage.get(from);
    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == to);
        switch (isAlready) {
          case (?isAlready) {
            switch (isAlready.expires_at) {
              case (null) {
                return isAlready.allowance;
              };
              case (?expiryDate) {
                // let currentTime =Int.toNat(Time.now() / 1000000);
                let now = Nat64.fromNat(Int.abs(Time.now()));
                if (expiryDate >= now) {
                  return isAlready.allowance;

                } else {
                  return 0;

                };

              };
            };

          };
          case (null) {

            return 0;

          };
        };

      };
      case (null) {
        return 0;
      };
    };
  };
  func updateAllownce(to : Id, from : Id, tokens : Tokens) : () {
    let allownce = allownceStorage.get(from);
    switch (allownce) {
      case (?isAllownce) {

        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == to);
        switch (isAlready) {
          case (?isAlready) {
            var filtered = Array.filter<AllowanceRecord>(isAllownce, func x = x.to != to);
            let newAllownce = isAlready.allowance -tokens;
            let tempAllownce : AllowanceRecord = {
              to = to;
              allowance = newAllownce;
              expires_at = isAlready.expires_at;
            };
            var newArray = Array.append<AllowanceRecord>(filtered, [tempAllownce]);
            let added = allownceStorage.put(from, newArray);

          };
          case (null) {
            let tempAllownce : AllowanceRecord = {
              to = to;
              allowance = 0;
              expires_at = null;
            };
            var newArray = Array.append<AllowanceRecord>(isAllownce, [tempAllownce]);
            let added = allownceStorage.put(from, newArray);

          };
        };

      };
      case (null) {

      };
    };
  };
  func checkBalance(account : Id) : Tokens {
    let balance = accountStorage.get(account);
    switch (balance) {
      case (?isBalance) {
        return isBalance;

      };
      case (null) {
        return 0;
      };
    };
  };
  public shared ({ caller }) func icrc2_transfer_from({
    spender_subaccount : ?Subaccount;
    from : Account;
    to : Account;
    amount : Tokens;
    fee : ?Tokens;
    memo : ?Memo;
    created_at_time : ?Timestamp;
  }) : async Result<TxIndex, TransferFromError> {
    let allownce = getAllowence(from.owner, caller);
    if (allownce <= 0) {
      return #Err(#InsufficientAllowance { allowance = allownce });

    } else {
      if (amount <= allownce) {
        let balance = checkBalance(from.owner);
        if (balance >= amount) {
          let tempBalanceOfSender = accountStorage.get(from.owner);
          switch (tempBalanceOfSender) {
            case (?tempBalanceOfSender) {
              if (tempBalanceOfSender < amount) {
                return #Err(#InsufficientFunds { balance = tempBalanceOfSender });
              };
              let newBalanceOfSender = tempBalanceOfSender - amount;
              let sended = accountStorage.replace(from.owner, newBalanceOfSender);
              let receiverBalance = accountStorage.get(to.owner);
              switch (receiverBalance) {
                case (?receiverBalance) {
                  let tempNewReceiverBalance = receiverBalance +amount;
                  let added = accountStorage.replace(to.owner, tempNewReceiverBalance);
                  let ans = updateAllownce(caller, from.owner, amount);
                  return #Ok(amount);
                };
                case (null) {
                  let ans = updateAllownce(caller, from.owner, amount);
                  let receiverBalance = accountStorage.put(to.owner, amount);
                  return #Ok(amount);

                };
              };

            };
            case (null) {
              return #Err(#InsufficientAllowance { allowance = allownce });

            };
          };

        } else {
          return #Err(#InsufficientAllowance { allowance = allownce });
        };

      } else {
        return #Err(#InsufficientAllowance { allowance = allownce });

      };

    };
  };

  public query func icrc2_allowance({ account : Account; spender : Account }) : async Allowance {
    let allownce = allownceStorage.get(account.owner);
    var allowance = 0;
    var expiryDate : ?Nat64 = null;

    switch (allownce) {
      case (?isAllownce) {
        var isAlready = Array.find<AllowanceRecord>(isAllownce, func x = x.to == spender.owner);
        switch (isAlready) {
          case (?isAlready) {
            allowance := isAlready.allowance;
            expiryDate := isAlready.expires_at;

          };
          case (null) {

          };
        };

      };
      case (null) {

      };
    };
    return { allowance = allowance; expires_at = expiryDate };
  };
  func initail_mints() : () {
    let balance = accountStorage.get(init.minting_account.owner);
    switch (balance) {
      case (?isBalance) {
        let newBalance = isBalance +init.minting_account.amount;
        let balance = accountStorage.replace(init.minting_account.owner, newBalance);

      };
      case (null) {

        let balance = accountStorage.put(init.minting_account.owner, init.minting_account.amount);
      };
    };
    totall_supply := init.minting_account.amount;
  };
  // initail_mints();

  /*
isSuperAdmin use to check caller is has rights or not
@parma { userCanisterId : Text;userId:Id}
@return boolean

*/
  func isSuperAdmin(userCanisterId : Text, userId : Id) : async () {
    let userCanister = actor (userCanisterId) : actor {
      check_user_exists : (caller : Principal) -> async Bool;
      entry_require_permission : (pal : Principal, perm : Permission) -> async Bool;

    };
    let isUser = await userCanister.check_user_exists(userId);
    assert isUser;
    assert await userCanister.entry_require_permission(userId, #assign_role);
  };
  /*
mint_tokens use to  mint tokens only super admin can call
@parma { userCanisterId : Text;tokens:Tokens}
@return boolean

*/
  public shared ({ caller }) func mint_tokens(tokens : Tokens, userCanisterId : Text) : async Bool {
    await isSuperAdmin(userCanisterId, caller);
    let balance = accountStorage.get(init.minting_account.owner);
    let tempTime = getCurrentDate();
    let tempMinter : TokenMinter = {
      tokens = tokens;
      creation_time = tempTime;
      user = caller;
      name = "";
      wallet = init.minting_account.owner;
    };
    let entryId = EntryType.generateNewRemoteObjectId();
    switch (balance) {
      case (?isBalance) {

        var newTokens = isBalance +tokens;
        totall_supply += tokens;

        let _res = accountStorage.replace(init.minting_account.owner, newTokens);

        minterStorage.put(entryId, tempMinter);
        return true;

      };
      case (null) {
        totall_supply += tokens;

        accountStorage.put(init.minting_account.owner, tokens);
        minterStorage.put(entryId, tempMinter);

        return true;

      };
    };
  };
  /*
mint_tokens use to  mint tokens only super admin can call
@parma { userCanisterId : Text;tokens:Tokens}
@return boolean

*/
  public shared ({ caller }) func burn_tokens(tokens : Tokens, userCanisterId : Text) : async Bool {
    await isSuperAdmin(userCanisterId, caller);
    let mintingAccount = init.minting_account.owner;
    let balance = accountStorage.get(mintingAccount);
    let tempTime = getCurrentDate();
    let tempBurner : TokenBurn = {
      tokens = tokens;
      creation_time = tempTime;
      user = caller;
      name = "";
    };
    let entryId = EntryType.generateNewRemoteObjectId();
    switch (balance) {
      case (?isBalance) {
        if (isBalance >= tokens and isBalance > 0 and tokens > 0) {
          var newTokens = isBalance - tokens;
          totall_supply -= tokens;

          let _res = accountStorage.replace(mintingAccount, newTokens);

          let _res2 = burnerStorage.put(entryId, tempBurner);
          return true;
        } else {
          return false;

        };

      };
      case (null) {

        return false;

      };
    };
  };
  /*
compareFunc use to sort array by creation date used as a callback
@perms (_ka : Key, a : Transaction), (_kb : Key, b : Transaction)
@return order.Order

  */
  let compareFunc = func((_ka : Text, a : TokenMinter or TokenBurn), (_kb : Text, b : TokenMinter or TokenBurn)) : Order.Order {
    if (a.creation_time > b.creation_time) {
      return #less;
    } else if (a.creation_time < b.creation_time) {
      return #greater;
    } else {
      return #equal;
    };
  };
  /*
getAllMinters use to get minter list who mint tokens
@parma {   userId:?Id;
      page : Nat;
      limit : Nat;
}
@return  { total : Nat; users : Minters

*/
  public query ({ caller }) func getAllMinters(
    props : {
      userId : ?Id;
      page : Nat;
      limit : Nat;

    }
  ) : async { total : Nat; minters : Minters } {
    assert Principal.isController(caller);

    var limit = getLimit(props.limit);

    var tempTokenMinter = Map.HashMap<Text, TokenMinter>(0, Text.equal, Text.hash);

    for ((key, minter) in minterStorage.entries()) {

      switch (props.userId) {

        case (null) {
          tempTokenMinter.put(key, minter)

        };
        case (?isuserId) {
          if (minter.user == isuserId) {
            tempTokenMinter.put(key, minter);
          };
        };

      };

    };
    let tempMinters : Minters = Iter.toArray(tempTokenMinter.entries());
    let sortedMinters = Array.sort(tempMinters, compareFunc);
    let totalMinters = Array.size(sortedMinters);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalMinters) {
      return { total = totalMinters; minters = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalMinters) {
      endIndex := totalMinters;
    };

    let slicedMinters = Iter.toArray(Array.slice<(Text, TokenMinter)>(sortedMinters, startIndex, endIndex));
    return {
      total = totalMinters;
      minters = slicedMinters;
    };

  };
  /*
getAllBurners use to get token burner list who burn tokens
@parma {   userId:?Id;
      page : Nat;
      limit : Nat;
}
@return  { total : Nat; users : Minters;

*/
  public query ({ caller }) func getAllBurners(
    props : {
      userId : ?Id;
      page : Nat;
      limit : Nat;

    }
  ) : async { total : Nat; burners : Burners } {
    assert Principal.isController(caller);

    var limit = getLimit(props.limit);

    var tempTokenBurner = Map.HashMap<Text, TokenBurn>(0, Text.equal, Text.hash);

    for ((key, burner) in burnerStorage.entries()) {

      switch (props.userId) {

        case (null) {
          tempTokenBurner.put(key, burner)

        };
        case (?isuserId) {
          if (burner.user == isuserId) {
            tempTokenBurner.put(key, burner);
          };
        };

      };

    };
    let tempBurner : Burners = Iter.toArray(tempTokenBurner.entries());
    let sortedBurner = Array.sort(tempBurner, compareFunc);
    let totalBurner = Array.size(sortedBurner);
    let startIndex : Nat = props.page * limit;
    if (startIndex >= totalBurner) {
      return { total = totalBurner; burners = [] };
    };

    var endIndex : Nat = startIndex + limit;
    if (endIndex > totalBurner) {
      endIndex := totalBurner;
    };

    let burnersList = Iter.toArray(Array.slice<(Text, TokenBurn)>(sortedBurner, startIndex, endIndex));
    return {
      total = totalBurner;
      burners = burnersList;
    };

  };
  system func preupgrade() {
    stable_accounts := Iter.toArray(accountStorage.entries());
    stable_allownce := Iter.toArray(allownceStorage.entries());
    stable_token_minter := Iter.toArray(minterStorage.entries());
    stable_token_burn := Iter.toArray(burnerStorage.entries());

  };
  system func postupgrade() {
    accountStorage := Map.fromIter<Id, Tokens>(stable_accounts.vals(), stable_accounts.size(), Principal.equal, Principal.hash);
    allownceStorage := Map.fromIter<Id, [AllowanceRecord]>(stable_allownce.vals(), stable_allownce.size(), Principal.equal, Principal.hash);
    minterStorage := Map.fromIter<Text, TokenMinter>(stable_token_minter.vals(), stable_token_minter.size(), Text.equal, Text.hash);
    burnerStorage := Map.fromIter<Text, TokenBurn>(stable_token_burn.vals(), stable_token_burn.size(), Text.equal, Text.hash);

    stable_accounts := [];
    stable_allownce := [];
    stable_token_minter := [];
    stable_token_burn := [];
  };
};
