import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [nric, setNric] = useState("");
  const [walletAddress, setWallet] = useState("");
  const [receipt, setReceipt] = useState("");
  const [status, setStatus] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setURL] = useState("");
  const [imageurl, setImageURL] = useState("");
 
  useEffect(async () => { 
    const walletResponse = await getCurrentWalletConnected();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);

    addWalletListener();
  }, []);

  const connectWalletPressed = async () => { 
    const walletResponse = await connectWallet();
    setStatus(walletResponse.status);
    setWallet(walletResponse.address);
  };

  const onMintPressed = async () => { 
    console.log("OnMintPressed, NRIC: " + nric);
    console.log("OnMintPressed, Wallet Address: " + walletAddress);

       //Get Receipt
    await fetch('http://localhost:8080/', {
      method: 'POST',
      body: JSON.stringify({
        nric: nric,
        walletaddress: walletAddress
      }),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
      })
      .then((response) => response.json())
      .then(async (data) => {
        console.log("OnMintPressed, response data: " + data);
        
        setReceipt(data);
        setName(nric + "_NFT");
        setDescription("User " + nric + " NFT")

        console.log("OnMintPressed, url: " + url);     
        console.log("OnMintPressed, name: " + name);     
        console.log("OnMintPressed, description: " + description);  

        //  Mint NFT
        const { status, imageurl } = await mintNFT(url, name, description, receipt);
        setStatus(status);
        setImageURL(imageurl);

      })
      .catch((err) => {
        console.log(err.message);
        alert("Receipt not available, No Minting possible!!!")
      });  
  };

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      setStatus(
        <p>
          {" "}
          🦊{" "}
          <a target="_blank" href={`https://metamask.io/download.html`}>
            You must install Metamask, a virtual Ethereum wallet, in your
            browser.
          </a>
        </p>
      );
    }
  }  

  return (
    <div className="Minter">
      <button id="walletButton" onClick={connectWalletPressed}>
        {walletAddress.length > 0 ? (
          "Connected: " +
          String(walletAddress).substring(0, 6) +
          "..." +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>

      <br></br>
      <h1 id="title">🧙‍♂️ Mint your NFT</h1>
      <p>
        Please add your NRIC, then press "Mint."
      </p>
      <form>
      <h2>🤔 NRIC: </h2>
        <input
          type="text"
          placeholder="e.g. NXXXXXXXXX!"
          onChange={(event) => setNric(event.target.value)}
        />
        <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        />               
      </form>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <p id="status">
        {status}
      </p>
      <div>
      <img
        src={imageurl}
        alt="car"
      />
      </div>
    </div>    
  );
};

export default Minter;

