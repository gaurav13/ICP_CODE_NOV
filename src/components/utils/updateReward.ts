import { E8S } from '@/constant/config';
import logger from '@/lib/logger';
import { Auth } from '@/types/store';

interface Props {
  identity: any;
  auth: Auth;
  setReward: (input: number) => void;
}
export default function updateReward({ identity, setReward, auth }: Props) {
  try {
    const getRewards = async () => {
      if (auth.state !== 'initialized' || !identity) return;
let tempReward=[];
      let tempUser  = await auth.actor.get_reward_of_user_count();
      if(tempUser){
        tempReward=tempUser;
      }

      let allAmount = Number(tempReward?.all) ?? 0;
      let claimedAmount =  Number(tempReward?.claimed) ?? 0;;
      let unClaimedAmount =  Number(tempReward?.unclaimed) ?? 0;
      setReward(unClaimedAmount ?? 0);
    };
    getRewards();
  } catch (error) {
    logger(error);
  }
}
