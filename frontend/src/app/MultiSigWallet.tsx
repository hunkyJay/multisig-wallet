import React, { useState, useEffect } from "react";
import { useMultiSigWalletContext} from "../contexts/MultiSigWallet";
import { Button } from "semantic-ui-react";
import DepositForm from "./DepositForm";
import CreateTxModal from "./CreateTxModal";
import TxList from "./TxList";
import { useNavigate } from "react-router-dom";//
import { useWeb3Context } from '../contexts/Web3';//
import Network from "./Network";//
import './MultiSigWallet.css';
import HistoryModal from "./HistoryModal";
import useDocumentTitle from '../components/useDocumentTitle';


function MultiSigWallet() {
    useDocumentTitle('Dashboard - MultiSigWallet');
    const { state } = useMultiSigWalletContext();
    const { state: web3State } = useWeb3Context();
    const { netId } = web3State;
    const { account } = web3State;
    const navigate = useNavigate(); // Get access to navigate function
    const [open, openModal] = useState(false);

    // const [showHistory, setShowHistory] = useState(false); // Show history of transactions
    const [historyModalOpen, setHistoryModalOpen] = useState(false);
    const openHistoryModal = () => setHistoryModalOpen(true);
    const closeHistoryModal = () => setHistoryModalOpen(false);

    useEffect(() => {
        // Function to execute when the component mounts or when web3State.account changes
        const handleAccountChange = () => {
            // Check if an account is connected
            if (web3State.account) {
                // Optionally, you can add logic here to handle specific account changes
                console.log("Account connected:", web3State.account);
            } else {
                // If account is disconnected/switched
                navigate("/");
            }
        };

        handleAccountChange();

    }, [web3State.account, navigate]);

    // const toggleHistory = () => setShowHistory(!showHistory);

    return (
        <div className="MultiSigWallet">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <img src="/network.svg" alt="Ethernet Icon" className="network-icon" />
                <span>{netId !== 0 && <Network netId={netId} />}</span>
            </div>
            <header className="Wallet-header">
                {/* {netId !== 0 && <Network netId={netId} />} */}
                <div>MultiSig Wallet: {state.address}</div>
                <div>Current User: {account}</div>
            </header>
            <h3>Balance: {state.balance} wei</h3>
            <DepositForm />
            <h3>Owners</h3>
            <ul className="Owener-card">
                {state.owners.map((owner, i) => (
                    <li key={i} className="owner-item">
                        <img className="UserIcon" src={"/userIcon.svg"} alt="User Icon" style={{ marginRight: '8px' }} />
                        {owner}
                    </li>
                ))}
                <div>Confirmations Required: {state.numConfirmationsRequired}</div>
            </ul>
            {/* <div>Confirmations required: {state.numConfirmationsRequired}</div> */}
            <h3>Transactions ({state.transactionCount})</h3>
            <div>
                <Button className="Button-margin" onClick={() => openModal(true)}>
                    Create Transaction
                </Button>
                {/* <Button onClick={toggleHistory}>
                    {showHistory ? "Hide" : "Show"} History
                </Button> */}
                <Button onClick={openHistoryModal}>
                    View History
                </Button>
            </div>
            {open && <CreateTxModal open={open} onClose={() => openModal(false)} />}
            <TxList
                numConfirmationsRequired={state.numConfirmationsRequired}
                // data={state.transactions}
                // data={showHistory ? state.transactions : state.transactions.filter(tx => !tx.executed)}
                data = {state.transactions.filter(tx => !tx.executed)}
                count={state.transactionCount}
                owners = {state.owners}
                multiSigWalletAddress= {state.address}
            />
            <HistoryModal
                transactions={state.transactions.filter(tx => tx.executed)}
                open={historyModalOpen}
                onClose={closeHistoryModal}
            />
        </div>
    );
}

export default MultiSigWallet;