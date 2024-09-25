import React, { useState } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';//
import { Message, Button } from 'semantic-ui-react';
import { useWeb3Context } from '../contexts/Web3';
import { unlockAccount } from '../api/web3';
import { getOwnersList } from '../api/multisig-wallet';
import useAsync from '../components/useAsync';
import logo from './logo.svg';
import './App.css';
import useDocumentTitle from '../components/useDocumentTitle';


function App() {
  useDocumentTitle('Multisig Wallet');
  const navigate = useNavigate();//
  const {
    state: { account, netId},
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


//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Multisig Wallet</h1>
//         <div>Account: {account}</div>

//         {isConnected ?
//           <Message success>Metamask is connected</Message> :
//           <Message warning>Metamask is not connected</Message>
//         }
//       </header>
//       <Button className="Connect-button"
//         onClick={() => onClickConnect()}
//         disabled={pending}
//         loading={pending}
//       >Connect to Metamask
//       </Button>
//     </div>
//   );
// }

  function navigateToDashboard() {
    navigate('/dashboard');
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Multisig Wallet</h1>
        <div>Account: {account}</div>
        {isConnected ?
          <>
            <Message success>Metamask is connected</Message>
          </> :
          <Message warning>Metamask is not connected</Message>
        }
      </header>
      {isConnected ?
        <>
          <Button className="Dashboard-button" onClick={navigateToDashboard}>Go to Dashboard</Button>
        </> :
        <Button className="Connect-button"
          onClick={() => onClickConnect()}
          disabled={pending}
          loading={pending}
        >Connect to Metamask
        </Button>
      }
      {/* {!isConnected && (
        <Button className="Connect-button"
          onClick={() => onClickConnect()}
          disabled={pending}
          loading={pending}
        >Connect to Metamask
        </Button>
      )} */}
    </div>
  );
}


export default App;
