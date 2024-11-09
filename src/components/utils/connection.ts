import useLocalization from '@/lib/UseLocalization';
import { LANG } from '@/constant/language';

const ConnectPlugWallet = async () => {
  const { t, changeLocale } = useLocalization(LANG);
  if (!window.ic) {
    return {
      success: false,
      msg: 'Install Plug Wallet',
      alreadyConnected: false,
    };
  }
  const connected = await window.ic.plug.isConnected();
  if (connected) {
    return { success: true, msg: t('Already Connected'), alreadyConnected: true };
  } else {
    const whitelist = [process.env.NEXT_PUBLIC_ENTRY_CANISTER_ID];

    const onConnectionUpdate = async () => {};
    try {
      const publicKey = await window.ic.plug.requestConnect({
        whitelist,
        host: process.env.NEXT_PUBLIC_IC_HOST,
        onConnectionUpdate,
        timeout: 50000,
      });

      return {
        success: true,
        msg: t('Connected Successfully'),
        alreadyConnected: false,
      };
    } catch {
      return {
        success: false,
        msg: t('Failed to Connect Plug Wallet'),
        alreadyConnected: false,
      };
    }
  }
};
export { ConnectPlugWallet };
