import React, { useState } from 'react';
import { Message, Button } from 'semantic-ui-react';
import { useWeb3Context } from '../contexts/Web3';
import { unlockAccount } from '../api/web3';
import { getOwnersList } from '../api/multisig-wallet';
import useAsync from '../components/useAsync';
import logo from './logo.svg';
import './App.css';

function App() {
  const {
    state: { account },
    updateAccount
  } = useWeb3Context();

  const [isConnected, setIsConnected] = useState(false);
  const { pending, error, call } = useAsync(unlockAccount);

  async function onClickConnect() {
    const { error, data } = await call(null);

    if (error) {
      console.error(error);
      setIsConnected(false);
      return;
    }

    if (data && data.web3) {
      try {
        const owners = await getOwnersList(data.web3);
        if (owners.includes(data.account)) {
          updateAccount(data);
          setIsConnected(true);
        } else {
          alert("Your account is not an owner of this contract.");
          setIsConnected(false);
        }
      } catch (error) {
        alert("The contract is not deployed at the net selected.");
        console.error(error);
        setIsConnected(false);
      }

    }

  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multisig Wallet</h1>
        <div>Account: {account}</div>

        {isConnected ?
          <Message success>Metamask is connected</Message> :
          <Message warning>Metamask is not connected</Message>
        }
      </header>
      <Button className="Connect-button"
        onClick={() => onClickConnect()}
        disabled={pending}
        loading={pending}
      >Connect to Metamask
      </Button>
    </div>
  );
}

export default App;
