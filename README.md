TOKEN FAUCET
======
Faucet implementation with custom token, that is created using ERC-20 standard.
Contracts are located in ``ERC-20-TOKEN`` folder and UI in ``client`` folder.


Setup & run
======

The .env file should contain the following:

```sh
# .env vars
GOERLI_URL=https://goerli.infura.io/v3/xxxxxxxxxx
PRIVATE_KEY=xxxxxxxxxx
```
The ``PRIVATE_KEY`` is the key that is located in the Metamsk wallet. Click on the menu (three dots) in the upper right corner, and then on the "Account Details" button. Click “Export Private Key”.

The ``GORLI_URL`` value is an endpoint address for Görli testnet from https://www.infura.io/.

```sh
# Start
cd client && npx run start
```