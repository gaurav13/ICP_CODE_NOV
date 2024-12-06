import { makeUserActor } from '@/dfx/service/actor-locator';
import logger from '@/lib/logger';
import { Actor, Identity } from '@dfinity/agent';
import { AuthClient } from '@dfinity/auth-client';
import { JsonnableDelegationChain } from '@dfinity/identity';
import { ConnectPlugWalletSlice, ConnectStore } from '@/types/store';
import React from 'react';
import { create } from 'zustand';
import { Principal } from '@dfinity/principal';
import { NFID } from '@nfid/embed';
import { createAgent } from '@dfinity/utils';
import { appData } from '@/constant/image';
import { LoginEnum } from '@/lib/utils';

interface AuthState {
  state: string;
  actor: Actor | null;
  client: AuthClient | null;
}
interface methodsProps {
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
  useConnectPlugWalletStore: ReturnType<typeof create>;
  client?: AuthClient;
  handleClose?: () => void;
}

const authMethods = ({
  setIsLoading,
  useConnectPlugWalletStore,
  handleClose,
  client,
}: methodsProps) => {
  const { auth, setAuth, setUserAuth,setIdentity } = useConnectPlugWalletStore((state) => ({
    auth: (state as ConnectPlugWalletSlice).auth,
    setAuth: (state as ConnectPlugWalletSlice).setAuth,
    setUserAuth: (state as ConnectPlugWalletSlice).setUserAuth,
    setIdentity: (state as ConnectPlugWalletSlice).setIdentity,

  }));

  //
  const initAuth = async () => {
    setAuth({ ...auth, isLoading: true });
    const nfid = await NFID.init({
      application: {
        name: appData.name,
        logo: appData.logo,
      },
      idleOptions: {
        // idleTimeout: 45 * 60 * 1000,
        // captureScroll: true,
        disableIdle: true,
        disableDefaultIdleCallback: true,
      },
    });
    const client = await AuthClient.create({
      idleOptions: {
        idleTimeout: 1000 * 60 * 30, // set to 30 minutes
        disableDefaultIdleCallback: true, // disable the default reload behavior
      },
    });
    logger({nfid},"nfid intial error")
    if (setIsLoading) {
      setIsLoading(true);
      if (await client.isAuthenticated()) {
        const tempAuth = await authenticate(client);
        setIsLoading(false);
        return { success: false, actor: tempAuth };
      } else if (nfid.isAuthenticated) {
        const tempAuth = await authenticate(undefined, nfid.getIdentity());
        setIsLoading(false);
        return { success: false, actor: tempAuth };
      } else {
        setIsLoading(false);
        const tempActor = makeUserActor();
        setAuth({
          ...auth,
          state: 'anonymous',
          actor: tempActor,
          client,
          isLoading: false,
        });
        return { success: false, actor: tempActor };
      }
    }
    return { success: false, actor: null };
  };
  const login = async (type: LoginEnum) => {
    logger('TRYING', process.env.DFX_NETWORK);
    let ran = false;
    setAuth({
      ...auth,
      isLoading: true,
    });
    if (auth && auth.state === 'anonymous' && auth.client && handleClose) {
      if (type === LoginEnum.InternetIdentity) {
      await auth.client.login({
        // maxTimeToLive: BigInt(1800) * BigInt(1_000_000_000),
        identityProvider:
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app/#authorize'
            : `http://${process.env.NEXT_PUBLIC_INTERNET_IDENTITY_CANISTER_ID}.localhost:8000/#authorize`,
        // `http://localhost:8000?canisterId=${process.env.INTERNET_IDENTITY_CANISTER_ID}#authorize`,
        onSuccess: () => {
          authenticate(auth.client as AuthClient);
          localStorage.removeItem("token")
        },
        onError: () => {
          setAuth({
            ...auth,
            isLoading: false,
          });
          // handleClose();
        },
      });
      const refreshLogin = () => {
        // prompt the user then refresh their authentication
        if (auth.client) {
          auth.client.login({
            onSuccess: async () => {
              authenticate(auth.client as AuthClient).then(() => {
                handleClose();
              });
            },
          });
        }
      };

      auth.client.idleManager?.registerCallback?.(refreshLogin);
    } else if (type === LoginEnum.NFID) {
      try {
        const nfid = await NFID.init({
          application: {
            name: appData.name,
            logo: appData.logo,
          },
          idleOptions: {
            // idleTimeout: 45 * 60 * 1000,
            // captureScroll: true,
            disableIdle: true,
            disableDefaultIdleCallback: true,
          },
        });
        const delegationIdentity: Identity = await nfid.getDelegation({
          maxTimeToLive: BigInt(30 * 24 * 60 * 60 * 1000 * 1000 * 1000)
       
        });
        authenticate(undefined, delegationIdentity)
      } catch (error) {
        setAuth({
          ...auth,
          isLoading: false,
        });
      }
    }
    } else if (auth && !ran && auth.state === 'anonymous') {
      initAuth();
      ran = true;
    } else {setAuth({
      ...auth,
      isLoading: false,
    });
      logger('Login did not start');
    }
  };
  const logout = async () => {
    setAuth({ ...auth, isLoading: true });

    if (auth.state === 'initialized' ) {
      logger('LOGGIN OUT');
      if (auth.client instanceof AuthClient) {
        await auth.client.logout();
      } else if (NFID._authClient.isAuthenticated) {
        await NFID._authClient.logout();
      }

      setAuth({
        ...auth,

        state: 'anonymous',
        actor: null,
        client: null,
        isLoading: false,
      });
      setUserAuth({
        name: '',
        status: false,
        role: '',
        principalText: '',
        principalArray: null,
        userPerms: null,
        isAdminBlocked: false,
      });
      setIdentity(null)
      // router.push('/');
    }
  };
  const getPerms = (role: any) => {
    let userPerms = {
      userManagement: false,
      articleManagement: false,
      adminManagement: false,
    };
    if (role.hasOwnProperty('authorized')) {
      userPerms = {
        adminManagement: false,
        userManagement: false,
        articleManagement: false,
      };
    } else if (role.hasOwnProperty('user_admin')) {
      userPerms = {
        adminManagement: false,
        userManagement: true,
        articleManagement: false,
      };
    } else if (role.hasOwnProperty('article_admin')) {
      userPerms = {
        adminManagement: false,
        userManagement: false,
        articleManagement: true,
      };
    } else if (role.hasOwnProperty('sub_admin')) {
      userPerms = {
        adminManagement: false,
        userManagement: true,
        articleManagement: true,
      };
    } else if (role.hasOwnProperty('admin')) {
      userPerms = {
        adminManagement: true,
        userManagement: true,
        articleManagement: true,
      };
    }
    return userPerms;
  };
  const authenticate = async (client?: AuthClient, identity?: Identity) => {
    try {
      if (!client && !identity) {
        return logger('Unexpected error while authenticating');
      }
      setAuth({
        ...auth,
        isLoading: true,
      });
      const development = process.env.DFX_NETWORK !== 'ic';
      logger(development, 'network type');

      const myIdentity = client? client.getIdentity():identity;
      setIdentity(myIdentity)
      const agent = await createAgent({
        identity: myIdentity as Identity,
        host: development ? 'http://localhost:4943' : 'https:icp0.io',
      });
      if (development) {
        try {
          await agent.fetchRootKey();
        } catch (error) {
          logger(error, 'unable to fetch root key');
        }
      }
      // setAgent(agent);
      if (!myIdentity) return logger('Unexpected error while authenticating');

      const actor = makeUserActor({
        agentOptions: {
          identity: myIdentity,
        },
      });
      const resp = await actor.add_user();
      if (resp.ok) {
        const user = resp.ok[1];
        const userPrincipalArray = myIdentity.getPrincipal();
        const userPrincipalText = userPrincipalArray.toString();
        let userPerms = getPerms(user.role);
        // logger(user.role == { authorized: null });
        setUserAuth({
          name: user.name,
          status: user.isBlocked,
          role: user.role,
          principalText: userPrincipalText,
          principalArray: userPrincipalArray,
          userPerms,
          isAdminBlocked: user.isAdminBlocked,
        });
        if (handleClose) handleClose();
      }
      setAuth({
        ...auth,
        state: 'initialized',
        actor,
        client,
        isLoading: false,
      });
      if (handleClose) handleClose();
      return actor;
    } catch (e) {
      logger(e,"asdvasdhasdasda")
      setAuth({
        ...auth,
        state: 'error',
      });
      if (handleClose) handleClose();
      setUserAuth({
        name: '',
        status: false,
        role: '',
        principalText: '',
        principalArray: null,
        userPerms: null,
        isAdminBlocked: false,
      });
      logger(e, 'Error while authenticating');
    }
  };

  const handleSessionTimeout = () => {
    // upon login the localstorage items may not be set, wait for next tick
    setTimeout(() => {
      try {
        const delegation = JSON.parse(
          window.localStorage.getItem('ic-delegation') as string
        ) as JsonnableDelegationChain;
        const expirationTimeMs =
          Number.parseInt(delegation.delegations[0].delegation.expiration, 16) /
          1000000;
        setTimeout(() => {
          logout();
        }, expirationTimeMs - Date.now());
      } catch {
        const a = auth.client?.idleManager;

        console.error(a, 'Could not handle delegation expiry.');
      }
    });
  };
  return {
    initAuth,
    login,
    logout,
    authenticate,
  };
};
export default authMethods;
// export default { initAuth, login, logout, authenticate };

// export default { initAuth, login, logout, authenticate };
