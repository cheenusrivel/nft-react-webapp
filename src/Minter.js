import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT } from "./utils/interact.js";

const Minter = (props) => {

  //State variables
  const [nric, setNric] = useState("");
  const [url, setURL] = useState("");
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
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
    //No Status
    setStatus("🦊 Minting NFT's...");

    // error handling
    if (nric.trim() == "" || (url.trim() == "" )) {  
      console.log("NRIC or URL is missing");
        setStatus("❗Please make sure all fields are completed before minting.");    
        return;
    }  else if (!/^[A-Z]{1}[0-9]{7}[A-Z]{1}$/.test(nric))   {
      setStatus("❗Please Enter Correct NRIC, e.g NXXXXXXXD.");
      setNric('');
      return;
    } else if (!/^(ftp|http|https):\/\/[^ "]+$/.test(url)) {
      setStatus("❗Please Enter correct URL.");
      setURL('');
      return;
    }

    console.log("OnMintPressed, NRIC: " + nric);
    console.log("OnMintPressed, Wallet Address: " + walletAddress);
    console.log("OnMintPressed, Fetching Receipt from api");

    const name = nric + "_nft";
    const description = "NFT for " + nric;
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
    .then(async (receipt) => {          
      console.log("onMintPressed , URL: " + url);
      console.log("onMintPressed , Name: " + name);
      console.log("onMintPressed , Decription: " + description);
      console.log("onMintPressed , Receipt: " + receipt);
      //  Mint NFT
      const { status, imageurl } = await mintNFT(url, name, description, receipt);
      setStatus(status);
      setImageURL(imageurl);
    })
    .catch((err) => {
      console.log(err.message);
      setStatus("❗Receipt not available, No Minting possible!!!");
      setImageURL('');
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
        Please add your NRIC and Link to asset, then press "Mint."
      </p>
      <form>
      <h2>🤔 NRIC: </h2>
        <input
          type="text"
          placeholder="e.g. NXXXXXXXD"
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
      />
      </div>
    </div>    
  );
};

export default Minter;

