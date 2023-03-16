import './App.css';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AssetTypeConfig, PageWrapper } from './components/Page';
import { H1 } from './components/Headers';
import { LoginManager } from './components/Login';
import { ContractConfig } from './components/ContractConfig';
import { useEffect } from 'react';
import { useWalletConnect, WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { useSetNetwork } from './hooks';
import { NetworkSwitcher } from './components/NetworkSwitcher';
import { TransactionHandler } from './components/TransactionHandler';
import { ErrorPopup } from './components/Popup';

function App() {
  return <WalletConnectContextProvider>
        <BrowserRouter basename='frontend-asset-classification'>
          <Routes>
            <Route path="/:network" element={<AppContent />} />
            <Route path="*" element={<Navigate to="/testnet" />} />
          </Routes>
        </BrowserRouter>
    </WalletConnectContextProvider>
}

function AppContent() {
  const location = useLocation()
  const { network } = useParams()
  const setNetwork = useSetNetwork()
  const { walletConnectService: wcs } = useWalletConnect()
  useEffect(() => {
    setNetwork(network)
  }, [location, network, setNetwork, wcs])

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
      <TransactionHandler />
      <ErrorPopup />
    </PageWrapper>
  );
}

export default App;
