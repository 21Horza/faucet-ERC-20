import { useEffect, useState } from "react";
import "./App.css";
import { ethers } from "ethers";
import faucetContract from "./ethereum/faucet";
import ErrorModal from './components/ErrorModal';
import { FaFaucet } from "react-icons/fa";
import { GiToken } from "react-icons/gi";

function App() {
  const [walletAddress, setWalletAddress] = useState("");
  const [signer, setSigner] = useState();
  const [contractInstance, setContractInstance] = useState();
  const [withdrawErr, setWithdrawErr] = useState("");
  const [withdrawSuccess, setWithdrawSuccess] = useState("");
  const [txData, setTxData] = useState("");
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    getCurrentWalletConnected();
    addWalletListener();
  }, [walletAddress]);

  const connectWallet = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
         
        const accounts = await provider.send("eth_requestAccounts", []);
        
        setSigner(provider.getSigner());
        
        setContractInstance(faucetContract(provider));

        setWalletAddress(accounts[0]);
        console.log(accounts[0]);

      } catch (err) {
        console.log(err.message);
      }
    } else {
      /* MetaMask is not installed */
      console.log("Please install MetaMask");
    }
  };

  const getCurrentWalletConnected = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
         
        const accounts = await provider.send("eth_accounts", []);
       
        if (accounts.length > 0) {
          setSigner(provider.getSigner());
          setContractInstance(faucetContract(provider));
          setWalletAddress(accounts[0]);
          console.log(accounts[0]);
        } else {
          console.log("Connect to MetaMask");
        }
      } catch (err) {
        console.log(err.message)
      }
    } else {
      console.log("Please install MetaMask");
    }
  };

  const getTokensHandler = async () => {
    setWithdrawErr("");
    setWithdrawSuccess("");
    setShowError(false);
    setShowSuccess(false);
    try {
      const contractAndSigner = contractInstance.connect(signer);
      const response = await contractAndSigner.requestToken();
      console.log(response);
      setWithdrawSuccess("Withdraw has been successful!");
      setTxData(response.hash);
      setShowSuccess(true)
    } catch (e) {
      if (JSON.stringify(e.message).includes("You aldready withdrew tokens")) {
        const msg = "You aldready withdrew tokens. You can withdraw tokens every 12 hours only. Please, try again later.";
        setShowError(true)
        setWithdrawErr(`Withdraw failed: ${msg}`)
      } else {
        console.log(e.message)
          setShowError(true)
            setWithdrawErr(`Withdraw failed: ${e.message}`)
      }
    }
  }

  const addWalletListener = async () => {
    if (typeof window != "undefined" && typeof window.ethereum != "undefined") {
      window.ethereum.on("accountsChanged", (accounts) => {
        setWalletAddress(accounts[0]);
        console.log(accounts[0]);
      });
    } else {
      /* MetaMask is not installed */
      setWalletAddress("");
      console.log("Please install MetaMask");
    }
  };

  return (
    <>
    {showError && <ErrorModal 
        active={showError} 
        setActive={setShowError}
    >
    <h1 style={{marginBottom: '10px', fontSize: 50, color: 'red'}}>{"Something went wrong"}</h1>
    <hr />
    <h1 style={{marginTop: '10px'}}>{withdrawErr}</h1>
    </ErrorModal>}
    {showSuccess && <ErrorModal 
        active={showSuccess} 
        setActive={setShowSuccess}
    >
    <h1 style={{marginBottom: '10px', fontSize: 50, color: 'green'}}>{"Success!"}</h1>
    <hr />
    <h1 style={{marginTop: '10px'}}>{withdrawSuccess}</h1>
    </ErrorModal>}
    <div>
      <div className="navbar">
        <div className="container">
          <div className="name">
            Custom Token (TKN)
          </div>
          <div className="connectBtn">
          <button
                onClick={connectWallet}
                
                >
                <span >
                  {walletAddress && walletAddress.length > 0
                    ? `Connected: ${walletAddress.substring(
                      0,
                      6
                      )}...${walletAddress.substring(38)}`
                      : "Connect Wallet"}
                </span>
              </button>
          </div>
        </div>
      </div>
      <div className="faucetBody">
        <div className="top">
          <h1 className="title">Token Faucet <FaFaucet className="faucetIcon"/></h1>
              <p>Test tokens. 100 TKN/day.</p>
        </div>
        <div className="middle">
          <div className="left">
                  <input
                    type="text"
                    placeholder="Enter your wallet address (0x...)"
                    defaultValue={walletAddress}
                    />
          </div>
          <div className="right">
                   <button
                    onClick={getTokensHandler}
                    className="button">
                    GET 
                    <GiToken className="tokenIcon"/>
                  </button>
          </div>
          </div>
          <div className="buttom">
            <div className="details">
              <p className="info">Transaction Data</p>
                    <p>
                      {txData ? `Transaction hash: ${txData}` : `No transaction data`}
                    </p>
            </div>
          </div>
      </div>
    </div>
    </>
  );
}

export default App;
