import React, { useState, useEffect } from "react";
import BN from "bn.js";
import TxActions from "./TxActions";
import { getConfirmationsForTransaction } from '../api/multisig-wallet';
import { useWeb3Context } from '../contexts/Web3';
import Web3 from "web3";

interface Transaction {
    txIndex: number;
    to: string;
    value: BN;
    data: string;
    executed: boolean;
    numConfirmations: number;
    isConfirmedByCurrentAccount: boolean;
}

interface Props {
    numConfirmationsRequired: number;
    count: number;
    data: Transaction[];
    owners: string[]; // Assuming you pass the owners array as a prop
    multiSigWalletAddress: string; // The address of the MultiSigWallet contract
}

const TxList: React.FC<Props> = ({
    numConfirmationsRequired,
    count,
    data,
    owners,
    multiSigWalletAddress
}) => {
    const [confirmations, setConfirmations] = useState<{ [txIndex: number]: { [address: string]: boolean } }>({});
    const { state } = useWeb3Context(); // Get web3 instance from context
    const web3 = state.web3 as Web3; // Get web3 instance from context

    useEffect(() => {
        const fetchConfirmations = async () => {
            const newConfirmations: { [txIndex: number]: { [address: string]: boolean } } = {};

            // Only fetch confirmations for unexecuted transactions
            for (const tx of data.filter(tx => !tx.executed)) {
                newConfirmations[tx.txIndex] = await getConfirmationsForTransaction(
                    web3,
                    multiSigWalletAddress,
                    tx.txIndex,
                    owners
                );
            }

            setConfirmations(newConfirmations);
        };

        fetchConfirmations();
    }, [web3, multiSigWalletAddress, data, owners]); // Dependency array

    return (
        <ul>
            {data.map(tx => (
                <li key={tx.txIndex} className="card">
                    <h3>Transaction ID: {tx.txIndex}</h3>
                    <div>To: {tx.to}</div>
                    <div>Value: {tx.value.toString()} wei</div>
                    <div>Data: {tx.data}</div>
                    <div>Executed: {tx.executed.toString()}</div>
                    <div>Confirmations: {tx.numConfirmations}</div>
                    
                    {!tx.executed && (
                        <div>
                            {/* Owners: */}
                            <ul className="Confirmation-card">
                                {owners.map((owner, i) => (
                                    <li key={i} className="owner-item">
                                        <img className="UserIcon" src={"/userIcon.svg"} alt="User Icon" style={{ marginRight: '8px' }} />
                                        {owner}
                                        {confirmations[tx.txIndex]?.[owner] ? " ✔" : ""}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                    {/* Transaction actions */}
                    <TxActions
                        numConfirmationsRequired={numConfirmationsRequired}
                        tx={tx}
                    />
                </li>
            ))}
        </ul>
    );
};

export default TxList;


// interface Props {
//     numConfirmationsRequired: number;
//     count: number;
//     data: Transaction[];
// }

// const TxList: React.FC<Props> = ({
//     numConfirmationsRequired,
//     count,
//     data
// }) => {
//     return (
//         <ul>
//             {data.map(tx => (
//                 <li key={tx.txIndex} className="card">
//                     <div>Transaction ID: {tx.txIndex}</div>
//                     <div>To: {tx.to}</div>
//                     <div>Value: {tx.value.toString()} wei</div>
//                     <div>Data: {tx.data}</div>
//                     <div>Executed: {tx.executed.toString()}</div>
//                     <div>Confirmations: {tx.numConfirmations}</div>
//                     <TxActions
//                         numConfirmationsRequired={numConfirmationsRequired}
//                         tx={tx}
//                     />
//                 </li>
//             ))}
//         </ul>
//     );
// };

// export default TxList;