import './App.css';
import { BrowserRouter, Route, Routes, useLocation, useParams } from 'react-router-dom';
import { AssetTypeConfig, PageWrapper } from './components/Page';
import { H1 } from './components/Headers';
import { LoginManager } from './components/Login';
import { ContractConfig } from './components/ContractConfig';
import { useEffect } from 'react';
import { useWalletConnect, WalletConnectContextProvider } from '@provenanceio/walletconnect-js';
import { WalletContextProvider } from '@provenanceio/wallet-lib';
import { useSetNetwork, useNetworkConfig } from './hooks';
import { NetworkSwitcher } from './components/NetworkSwitcher';

function App() {
  const networkConfig = useNetworkConfig()

  return <WalletConnectContextProvider network={networkConfig.network}>
      <WalletContextProvider 
        grpcServiceAddress={networkConfig.grpcUrl}
        walletUrl={networkConfig.walletUrl}>
        <BrowserRouter basename='frontend-asset-classification'>
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
    </PageWrapper>
  );
}

export default App;
