import React from "react";

interface Props {
    netId: number;
}

function getNetwork(netId: number) {
    switch (netId) {
        case 1:
            return "Mainnet";
        case 2:
            return "Morden test network";
        case 3:
            return "Ropsten network";
        case 4:
            return "Rinkeby test network";
        case 42:
            return "Kovan test network";
        case 5:
            return "Goerli test network";
        case 11155111:
            return "Sepolia test network";

        default:
            return "Test network";
    }
}

const Network: React.FC<Props> = ({ netId }) => {
    return <div>{getNetwork(netId)}</div>;
};

export default Network;