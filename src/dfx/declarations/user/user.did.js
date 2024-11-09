export const idlFactory = ({ IDL }) => {
  const EntryId = IDL.Text;
  const Role = IDL.Variant({
    'admin' : IDL.Null,
    'article_admin' : IDL.Null,
    'authorized' : IDL.Null,
    'user_admin' : IDL.Null,
    'sub_admin' : IDL.Null,
  });
  const Reward = IDL.Record({
    'creation_time' : IDL.Int,
    'claimed_at' : IDL.Opt(IDL.Int),
    'isClaimed' : IDL.Bool,
    'amount' : IDL.Nat,
  });
  const Rewards = IDL.Vec(Reward);
  const NewImageObject = IDL.Text;
  const User = IDL.Record({
    'dob' : IDL.Opt(IDL.Text),
    'authorDescription' : IDL.Opt(IDL.Text),
    'linkedin' : IDL.Opt(IDL.Text),
    'twitter' : IDL.Opt(IDL.Text),
    'isVerificationRequested' : IDL.Bool,
    'isAdminBlocked' : IDL.Bool,
    'instagram' : IDL.Opt(IDL.Text),
    'isBlocked' : IDL.Bool,
    'name' : IDL.Opt(IDL.Text),
    'designation' : IDL.Opt(IDL.Text),
    'authorInfo' : IDL.Opt(IDL.Text),
    'role' : Role,
    'email' : IDL.Opt(IDL.Text),
    'website' : IDL.Opt(IDL.Text),
    'facebook' : IDL.Opt(IDL.Text),
    'isVerified' : IDL.Bool,
    'joinedFrom' : IDL.Int,
    'gender' : IDL.Opt(IDL.Text),
    'rewards' : Rewards,
    'identificationImage' : IDL.Opt(NewImageObject),
    'bannerImg' : IDL.Opt(NewImageObject),
    'authorTitle' : IDL.Opt(IDL.Text),
    'profileImg' : IDL.Opt(NewImageObject),
  });
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User),
    'err' : IDL.Text,
  });
  const Id = IDL.Principal;
  const InputUser = IDL.Record({
    'dob' : IDL.Text,
    'authorDescription' : IDL.Text,
    'linkedin' : IDL.Text,
    'twitter' : IDL.Text,
    'instagram' : IDL.Text,
    'name' : IDL.Text,
    'designation' : IDL.Text,
    'authorInfo' : IDL.Text,
    'email' : IDL.Text,
    'website' : IDL.Text,
    'facebook' : IDL.Text,
    'gender' : IDL.Text,
    'bannerImg' : IDL.Opt(NewImageObject),
    'authorTitle' : IDL.Text,
    'profileImg' : IDL.Opt(NewImageObject),
  });
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User, IDL.Opt(User)),
    'err' : IDL.Text,
  });
  const Role__1 = IDL.Variant({
    'admin' : IDL.Null,
    'article_admin' : IDL.Null,
    'authorized' : IDL.Null,
    'user_admin' : IDL.Null,
    'sub_admin' : IDL.Null,
  });
  const Permission = IDL.Variant({
    'assign_role' : IDL.Null,
    'manage_user' : IDL.Null,
    'manage_article' : IDL.Null,
    'write' : IDL.Null,
  });
  const Id__1 = IDL.Principal;
  const ReturnMenualAndArtificialReward = IDL.Record({
    'to' : Id__1,
    'creation_time' : IDL.Int,
    'from' : Id__1,
    'isMenual' : IDL.Bool,
    'receiverName' : IDL.Text,
    'senderName' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const ReturnMenualAndArtificialRewardList = IDL.Vec(
    IDL.Tuple(IDL.Text, ReturnMenualAndArtificialReward)
  );
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
  const RewardValuesChangeRecordReturn = IDL.Record({
    'creation_time' : IDL.Int,
    'oldValue' : IDL.Nat,
    'newValue' : IDL.Nat,
    'changerName' : IDL.Text,
    'rewardType' : IDL.Text,
    'changer' : Id__1,
  });
  const RewardValuesChangeRecordReturnList = IDL.Vec(
    IDL.Tuple(IDL.Text, RewardValuesChangeRecordReturn)
  );
  const TokensClaimStatus__1 = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const TokensClaimStatus = IDL.Variant({
    'pending' : IDL.Null,
    'approved' : IDL.Null,
    'rejected' : IDL.Null,
  });
  const TokenClaimRequest = IDL.Record({
    'creation_time' : IDL.Int,
    'status' : TokensClaimStatus,
    'user' : IDL.Principal,
    'transectionFee' : IDL.Nat,
    'tokens' : IDL.Nat,
  });
  const TokenClaimRequests = IDL.Vec(IDL.Tuple(IDL.Text, TokenClaimRequest));
  const ListUserDashboard = IDL.Record({
    'unclaimedReward' : IDL.Nat,
    'isVerificationRequested' : IDL.Bool,
    'isAdminBlocked' : IDL.Bool,
    'claimedReward' : IDL.Nat,
    'isBlocked' : IDL.Bool,
    'name' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'isVerified' : IDL.Bool,
    'joinedFrom' : IDL.Int,
    'identificationImage' : IDL.Opt(NewImageObject),
  });
  const UsersReward = IDL.Record({
    'creation_time' : IDL.Int,
    'claimed_at' : IDL.Opt(IDL.Int),
    'isClaimed' : IDL.Bool,
    'reward_type' : IDL.Text,
    'amount' : IDL.Nat,
  });
  const UsersRewards__1 = IDL.Vec(UsersReward);
  const ListAdminUser = IDL.Record({
    'isAdminBlocked' : IDL.Bool,
    'isBlocked' : IDL.Bool,
    'name' : IDL.Opt(IDL.Text),
    'role' : Role,
    'email' : IDL.Opt(IDL.Text),
    'joinedFrom' : IDL.Int,
  });
  const UserId = IDL.Opt(IDL.Text);
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, User, IDL.Bool),
    'err' : IDL.Text,
  });
  const NewImageObject__1 = IDL.Text;
  const ListUser = IDL.Record({
    'isVerificationRequested' : IDL.Bool,
    'isAdminBlocked' : IDL.Bool,
    'isBlocked' : IDL.Bool,
    'name' : IDL.Opt(IDL.Text),
    'email' : IDL.Opt(IDL.Text),
    'isVerified' : IDL.Bool,
    'joinedFrom' : IDL.Int,
    'identificationImage' : IDL.Opt(NewImageObject),
  });
  const UsersRewards = IDL.Vec(UsersReward);
  const TopWinnerUserList = IDL.Record({
    'dob' : IDL.Opt(IDL.Text),
    'name' : IDL.Text,
    'joinedFrom' : IDL.Int,
    'gender' : IDL.Opt(IDL.Text),
    'rewards' : UsersRewards,
    'totalReward' : IDL.Int,
    'profileImg' : IDL.Opt(NewImageObject),
  });
  const RewardConfig = IDL.Record({
    'admin' : IDL.Nat,
    'platform' : IDL.Nat,
    'master' : IDL.Nat,
  });
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Text, IDL.Bool),
    'err' : IDL.Tuple(IDL.Text, IDL.Bool),
  });
  const UserCount = IDL.Record({
    'verified' : IDL.Int,
    'Users' : IDL.Int,
    'blocked' : IDL.Int,
    'unverified' : IDL.Int,
    'Unblocked' : IDL.Int,
  });
  const anon_class_25_1 = IDL.Service({
    'addReaderOfEntry' : IDL.Func([EntryId, IDL.Text], [IDL.Bool], []),
    'add_reward' : IDL.Func([IDL.Principal, IDL.Nat, IDL.Text], [IDL.Bool], []),
    'add_user' : IDL.Func([], [Result_1], []),
    'admin_update_user' : IDL.Func([Id, InputUser, IDL.Text], [Result], []),
    'assign_role' : IDL.Func(
        [IDL.Principal, IDL.Text, Role__1],
        [Result_1],
        [],
      ),
    'block_sub_admin' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'block_user' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'check_user_exists' : IDL.Func([IDL.Principal], [IDL.Bool], []),
    'claim_rewards_of_user' : IDL.Func([], [IDL.Bool], []),
    'entry_require_permission' : IDL.Func(
        [IDL.Principal, Permission],
        [IDL.Bool],
        ['query'],
      ),
    'getArticleReadReward' : IDL.Func([], [IDL.Nat], ['query']),
    'getBalanceOfMyWallets' : IDL.Func(
        [IDL.Text],
        [
          IDL.Record({
            'admin' : IDL.Nat,
            'master' : IDL.Nat,
            'plateform' : IDL.Nat,
          }),
        ],
        [],
      ),
    'getDailyLoginReward' : IDL.Func([], [IDL.Nat], ['query']),
    'getEmailVerificationReward' : IDL.Func([], [IDL.Nat], ['query']),
    'getListOfArtificialAndMenualRewardList' : IDL.Func(
        [IDL.Bool, IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'reward' : ReturnMenualAndArtificialRewardList,
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getListOfBurner' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat, IDL.Text],
        [IDL.Record({ 'total' : IDL.Nat, 'burners' : Burners })],
        [],
      ),
    'getListOfMinters' : IDL.Func(
        [IDL.Opt(IDL.Principal), IDL.Nat, IDL.Nat, IDL.Text],
        [IDL.Record({ 'total' : IDL.Nat, 'minters' : Minters })],
        [],
      ),
    'getMinimumClaimReward' : IDL.Func([], [IDL.Nat], ['query']),
    'getProfileCompReward' : IDL.Func([], [IDL.Nat], ['query']),
    'getRewardChangerList' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : RewardValuesChangeRecordReturnList,
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'getTokensClaimedRequests' : IDL.Func(
        [
          IDL.Text,
          IDL.Nat,
          IDL.Nat,
          TokensClaimStatus__1,
          IDL.Opt(IDL.Principal),
        ],
        [IDL.Record({ 'entries' : TokenClaimRequests, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'getTokensClaimedRequestsForUser' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'entries' : TokenClaimRequests,
            'totallAproved' : IDL.Nat,
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_NFT24Coin' : IDL.Func([], [IDL.Nat], ['query']),
    'get_authorized_users' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'users' : IDL.Vec(IDL.Tuple(Id, ListUserDashboard)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_newUserReward' : IDL.Func([], [IDL.Nat], ['query']),
    'get_reward_of_user' : IDL.Func(
        [IDL.Nat, IDL.Nat],
        [IDL.Record({ 'reward' : UsersRewards__1, 'amount' : IDL.Nat })],
        ['query'],
      ),
    'get_reward_of_user_count' : IDL.Func(
        [],
        [
          IDL.Record({
            'all' : IDL.Nat,
            'unclaimed' : IDL.Nat,
            'claimed' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_subAdmin_users' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'users' : IDL.Vec(IDL.Tuple(Id, ListAdminUser)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_user_details' : IDL.Func([UserId], [Result_3], ['query']),
    'get_user_email' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Record({ 'email' : IDL.Opt(IDL.Text) }))],
        ['query'],
      ),
    'get_user_name' : IDL.Func(
        [IDL.Principal],
        [
          IDL.Opt(
            IDL.Record({
              'name' : IDL.Opt(IDL.Text),
              'designation' : IDL.Opt(IDL.Text),
              'image' : IDL.Opt(NewImageObject__1),
            })
          ),
        ],
        ['query'],
      ),
    'get_user_name_only' : IDL.Func(
        [IDL.Principal],
        [IDL.Opt(IDL.Text)],
        ['query'],
      ),
    'get_users' : IDL.Func(
        [IDL.Text, IDL.Bool, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'users' : IDL.Vec(IDL.Tuple(Id, ListUser)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'get_winner_users' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Nat],
        [
          IDL.Record({
            'users' : IDL.Vec(IDL.Tuple(Id, TopWinnerUserList)),
            'amount' : IDL.Nat,
          }),
        ],
        ['query'],
      ),
    'give_reward' : IDL.Func([Id, IDL.Nat, IDL.Bool], [IDL.Bool], []),
    'isAlreadyReadTheEntry' : IDL.Func([EntryId], [IDL.Bool], ['query']),
    'isAlreadyVerifiedEmail' : IDL.Func([Id], [IDL.Bool], ['query']),
    'make_admin' : IDL.Func([IDL.Principal, Role__1], [IDL.Bool], []),
    'request_verification' : IDL.Func([NewImageObject__1], [Result], []),
    'saveRewardValuesChangerInterCanister' : IDL.Func(
        [Id, RewardConfig, RewardConfig],
        [],
        ['oneway'],
      ),
    'saveRewardValuesChangers' : IDL.Func(
        [Id, IDL.Nat, IDL.Nat, IDL.Text],
        [],
        ['oneway'],
      ),
    'token_request_approve' : IDL.Func([IDL.Text], [Result_2], []),
    'token_request_reject' : IDL.Func([IDL.Text], [Result_2], []),
    'unBlock_sub_admin' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'unBlock_user' : IDL.Func([IDL.Text, IDL.Text], [Result_1], []),
    'un_verify_user' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'updateArticleReadReward' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateDailyLoginReward' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateEmailVerificationReward' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateMinimumClaimReward' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateNewUserReward' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'updateProfileCompReward' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'update_NFT24Coin' : IDL.Func([IDL.Nat], [IDL.Bool], []),
    'update_user' : IDL.Func([InputUser, IDL.Text], [Result], []),
    'user_count' : IDL.Func([], [IDL.Int], ['query']),
    'verified_user_count' : IDL.Func([], [UserCount], ['query']),
    'verify_user' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
  return anon_class_25_1;
};
export const init = ({ IDL }) => { return []; };
