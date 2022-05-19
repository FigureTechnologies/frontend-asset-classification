import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { WalletConnectContextProvider } from "@provenanceio/walletconnect-js";
import { WalletContextProvider } from "@provenanceio/wallet-lib";
import { GRPC_URL, NETWORK, WALLET_URL } from "./constants";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <WalletConnectContextProvider network={NETWORK}>
      <WalletContextProvider 
        grpcServiceAddress={GRPC_URL}
        walletUrl={WALLET_URL}>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>
        </WalletContextProvider>
    </WalletConnectContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);