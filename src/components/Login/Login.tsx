import { QRCodeModal, useWalletConnect } from "@provenanceio/walletconnect-js";
import { FunctionComponent } from "react";
import styled from 'styled-components'
import { PRIMARY_ACCENT, PRIMARY_ACCENT_LIGHT } from "../../constants";
import { Button } from "../Button";

const Wrapper = styled.div`
    display: flex;
    padding: 20px;
    border: 1px solid ${PRIMARY_ACCENT};
    background: ${PRIMARY_ACCENT_LIGHT};
    border-radius: 5px;
    justify-content: space-between;
    align-items: center;
`

interface LoginManagerProps {

}

// hack because the types for the QRCodeModal aren't correct
const MyQRCodeModal: React.FC<any> = QRCodeModal

export const LoginManager: FunctionComponent<LoginManagerProps> = () => {
    const { walletConnectService: wcs, walletConnectState } = useWalletConnect()
    const isConnected = walletConnectState.status === 'connected'
    
    return <>
        <Wrapper>
            <div>
                {isConnected ? `Connected as: ${walletConnectState.address}` : 'Connect as contract admin for edit functionality'}
            </div>
            <Button onClick={() => isConnected ? wcs.disconnect() : wcs.connect()}>
                {isConnected ? 'Disconnect Wallet' : 'Connect Wallet'}
            </Button>
        </Wrapper>
        <MyQRCodeModal
            walletConnectService={wcs}
            walletConnectState={walletConnectState}
            title="Scan to initiate walletConnect-js session"
            devWallets={["figure_web", "figure_web_test"]}
            hideWallets={["provenance_extension"]}
          />
    </>
}