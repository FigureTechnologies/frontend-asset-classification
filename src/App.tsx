import './App.css';
import { BrowserRouter, Link, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { AssetTypeConfig, PageWrapper } from './components/Page';
import { H1 } from './components/Headers';
import { LoginManager } from './components/Login';
import { ContractConfig } from './components/ContractConfig';
import { useCallback, useEffect, useState } from 'react';
import { useWalletConnect, useWalletConnectService, WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { WalletContextProvider } from '@provenanceio/wallet-lib';
import { PROD_GRPC_URL, PROD_WALLET_URL, TEST_GRPC_URL, TEST_WALLET_URL } from './constants';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useSetNetwork, useNetworkConfig } from './hooks';
import styled from 'styled-components';
import Switch from 'react-switch'
import { NetworkSwitcher } from './components/NetworkSwitcher';

function App() {
  const networkConfig = useNetworkConfig()

  return <WalletConnectContextProvider network={networkConfig.network}>
      <WalletContextProvider 
        grpcServiceAddress={networkConfig.grpcUrl}
        walletUrl={networkConfig.walletUrl}>
        <BrowserRouter>
          <Routes>
            <Route path="/:network" element={<AppContent />} />
          </Routes>
        </BrowserRouter>
      </WalletContextProvider>
    </WalletConnectContextProvider>
}

function AppContent() {
  const location = useLocation()
  const { network } = useParams()
  const setNetwork = useSetNetwork()
  const { walletConnectService: wcs } = useWalletConnect()
  useEffect(() => {
    wcs.setNetwork(network || 'mainnet')
    setNetwork(network)
  }, [location, network])

  return (
    <PageWrapper>
      <H1>Asset Classification Contract</H1>
      <LoginManager />
      <ContractConfig />
      <Routes>
        <Route path="/" element={<AssetTypeConfig />} />
      </Routes>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <NetworkSwitcher />
      </div>
    </PageWrapper>
  );
}

export default App;
