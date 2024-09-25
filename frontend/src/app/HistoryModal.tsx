import React from 'react';
import { Modal, Button } from 'semantic-ui-react';
import BN from "bn.js";

interface Transaction {
    txIndex: number;
    to: string;
    value: BN;
    data: string;
    executed: boolean;
    numConfirmations: number;
    isConfirmedByCurrentAccount: boolean;
}

interface HistoryModalProps {
    transactions: Transaction[];
    open: boolean;
    onClose: () => void;
}
const HistoryModal: React.FC<HistoryModalProps> = ({ transactions, open, onClose }) => {
    return (
        <Modal open={open} onClose={onClose} size="large" className="History-modal">
            <Modal.Header>Transaction History</Modal.Header>
            <Modal.Content scrolling>
                <ul>
                    {transactions.map(tx => (
                        <li key={tx.txIndex} className="History-card">
                            <h3>Transaction ID: {tx.txIndex}</h3>
                            <div>To: {tx.to}</div>
                            <div>Value: {tx.value.toString()} wei</div>
                            <div>Data: {tx.data}</div>
                            <div>Executed: {tx.executed.toString()}</div>
                            <div>Confirmations: {tx.numConfirmations}</div>
                        </li>
                    ))}
                </ul>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose}>Close</Button>
            </Modal.Actions>
        </Modal>
    );
};

export default HistoryModal;
