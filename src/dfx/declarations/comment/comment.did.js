export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const ActivityType = IDL.Variant({
    'subscribe' : IDL.Null,
    'create_pressRelease' : IDL.Null,
    'create_podcats' : IDL.Null,
    'delete_article' : IDL.Null,
    'delete_podcats' : IDL.Null,
    'like_web3' : IDL.Null,
    'like' : IDL.Null,
    'comment_podcats' : IDL.Null,
    'create' : IDL.Null,
    'comment' : IDL.Null,
    'create_web3' : IDL.Null,
    'comment_pressRelease' : IDL.Null,
    'delete_pressRelease' : IDL.Null,
    'promote' : IDL.Null,
    'delete_web3' : IDL.Null,
  });
  const AdminActivityType = IDL.Variant({
    'reject' : IDL.Null,
    'edit_web3' : IDL.Null,
    'edit_event' : IDL.Null,
    'delete_article' : IDL.Null,
    'delete_podcats' : IDL.Null,
    'edit_category' : IDL.Null,
    'unBlock' : IDL.Null,
    'approve' : IDL.Null,
    'add_category' : IDL.Null,
    'editWeb3Views' : IDL.Null,
    'delete_category' : IDL.Null,
    'verify_user' : IDL.Null,
    'verify_web3' : IDL.Null,
    'delete_event' : IDL.Null,
    'block' : IDL.Null,
    'editViews' : IDL.Null,
    'delete_pressRelease' : IDL.Null,
    'un_verify_user' : IDL.Null,
    'add_event' : IDL.Null,
    'delete_web3' : IDL.Null,
  });
  const InputComment = IDL.Text;
  const Comment = IDL.Record({
    'creation_time' : IDL.Int,
    'content' : IDL.Text,
    'user' : IDL.Principal,
  });
  const Result_3 = IDL.Variant({
    'ok' : IDL.Tuple(Comment, IDL.Text),
    'err' : IDL.Text,
  });
  const Activity = IDL.Record({
    'activity_type' : ActivityType,
    'title' : IDL.Text,
    'time' : IDL.Int,
    'target' : IDL.Text,
  });
  const Activities = IDL.Vec(Activity);
  const Result_2 = IDL.Variant({
    'ok' : IDL.Tuple(Activities, IDL.Text),
    'err' : IDL.Text,
  });
  const AdminActivity = IDL.Record({
    'activity_type' : AdminActivityType,
    'title' : IDL.Text,
    'time' : IDL.Int,
    'target' : IDL.Text,
  });
  const AdminActivities = IDL.Vec(AdminActivity);
  const Result_1 = IDL.Variant({
    'ok' : IDL.Tuple(AdminActivities, IDL.Text),
    'err' : IDL.Text,
  });
  const Comments = IDL.Vec(Comment);
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(Comments, IDL.Text),
    'err' : IDL.Text,
  });
  const CommentItem = IDL.Record({
    'creation_time' : IDL.Int,
    'content' : IDL.Text,
    'user' : IDL.Principal,
    'entryId' : IDL.Text,
  });
  const anon_class_19_1 = IDL.Service({
    'addActivity' : IDL.Func(
        [UserId, IDL.Text, ActivityType, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'addAdminActivity' : IDL.Func(
        [UserId, IDL.Text, AdminActivityType, IDL.Text],
        [IDL.Bool],
        [],
      ),
    'addComment' : IDL.Func(
        [InputComment, IDL.Text, IDL.Text, IDL.Text, IDL.Text, IDL.Text],
        [Result_3],
        [],
      ),
    'getActivities' : IDL.Func([], [Result_2], ['query']),
    'getActivitiesDashboard' : IDL.Func(
        [IDL.Principal, IDL.Text],
        [Result_2],
        [],
      ),
    'getAdminActivities' : IDL.Func([UserId, IDL.Text], [Result_1], []),
    'getComments' : IDL.Func([IDL.Text], [Result], ['query']),
    'getCommentsofUser' : IDL.Func(
        [IDL.Principal, IDL.Nat, IDL.Nat],
        [IDL.Record({ 'entries' : IDL.Vec(CommentItem), 'amount' : IDL.Nat })],
        ['query'],
      ),
    'get_comment_reward' : IDL.Func([], [IDL.Nat], ['query']),
    'update_comment_reward' : IDL.Func([IDL.Text, IDL.Nat], [IDL.Nat], []),
  });
  return anon_class_19_1;
};
export const init = ({ IDL }) => { return []; };
