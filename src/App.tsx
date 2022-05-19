import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { AssetTypeConfig, PageWrapper } from './components/Page';
import { H1 } from './components/Headers';
import { LoginManager } from './components/Login';
import { ContractConfig } from './components/ContractConfig';

function App() {
  return (
    <PageWrapper>
      <H1>Asset Classification Contract</H1>
      <LoginManager />
      <ContractConfig />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AssetTypeConfig/>} />
        </Routes>
      </BrowserRouter>
    </PageWrapper>
  );
}

export default App;
