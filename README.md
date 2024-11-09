# Nftstudio24 decentralized media platform.

### Install dfx

```sh
sh -ci "$(curl -fsSL [https://internetcomputer.org/install.sh](https://internetcomputer.org/install.sh))"
```

### Install Packages

```bash
yarn install
```

### Running Nftstudio24

```bash
dfx deploy
```

_Remove **icp_ledger_canister** from **dfx.json** if you get any errors while deploying cansiters_

```bash
dfx start

yarn run dev
```
