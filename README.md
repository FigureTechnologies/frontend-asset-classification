# Frontend Asset Classification

This is a small dApp frontend for viewing/managing the configuration of the Figure [Asset Classification Smart Contract](https://github.com/FigureTechnologies/asset-classification-smart-contract).

When not connected to a wallet (or connected to a wallet that is not the contract's admin account), this UI will display a listing of the various asset types configured within the testnet/mainnet contract
instances, as well as the details of fees and verifiers for each asset type.

When connected to the admin's wallet, this configuration is editable and asset types can be added/removed.

## Testnet/Mainnet

There is a ui toggle (bottom of the page)/page route for switching between the testnet/mainnet contract instances so that both versions can be hosted via GitHub Pages.

## GitHub Pages

This UI is hosted on GitHub pages at [https://figuretechnologies.github.io/frontend-asset-classification](https://figuretechnologies.github.io/frontend-asset-classification). Branches can be deployed
with the [Build and Deploy GitHub Action](.github/workflows/publish-github-pages.yml).

## Local Development

In the project directory, you can start a development server with the following command:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.