import { toast } from 'react-toastify';

export const handleAdminDeleteEntry = async ({
  defaultEntryActor,
  setDeleting,
  refetchfn,
  handleClose,
  data,
}: {
  defaultEntryActor: any;
  setDeleting: any;
  refetchfn: any;
  handleClose: any;
  data: any;
}) => {
  let { id, commentCanisterId, userCanisterId } = data;
  setDeleting(true);
  const deletedCategory = await defaultEntryActor.adminDeleteEntry(
    id,
    commentCanisterId,
    userCanisterId
  );
  if (deletedCategory?.ok) {
    toast.success('Entry Deleted Successfully');
    refetchfn();
    handleClose();
  } else {
    toast.error(deletedCategory?.err);
  }
  setDeleting(false);
};
