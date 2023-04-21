import {pinJSONToIPFS} from './pinata.js'

require('dotenv').config();
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY;
const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require('../contract-abi.json')
const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;
const startDateInSecs = Math.floor(new Date(process.env.REACT_APP_MINT_START_DATE).getTime() / 1000);
const EndDateInSecs = Math.floor(new Date(process.env.REACT_APP_MINT_END_DATE).getTime() / 1000);

export const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const obj = {
          status: "👆🏽 Write a message in the text-field above.",
          address: addressArray[0],
        };
        return obj;
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: "eth_accounts",
        });
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            status: "👆🏽 Write a message in the text-field above.",
          };
        } else {
          return {
            address: "",
            status: "🦊 Connect to Metamask using the top right button.",
          };
        }
      } catch (err) {
        return {
          address: "",
          status: "😥 " + err.message,
        };
      }
    } else {
      return {
        address: "",
        status: (
          <span>
            <p>
              {" "}
              🦊{" "}
              <a target="_blank" href={`https://metamask.io/download.html`}>
                You must install Metamask, a virtual Ethereum wallet, in your
                browser.
              </a>
            </p>
          </span>
        ),
      };
    }
  };

  export async function mintNFT(url, name, description, receipt) {
    //error handling
    if (url.trim() == "" || (name.trim() == "" || description.trim() == "")) {
        return {
            success: false,
            status: "❗Please make sure all fields are completed before minting.",
        };
    }

    //make metadata
    const metadata = new Object();
    metadata.name = name;
    metadata.image = url;
    metadata.description = description;

    //make pinata call
    const pinataResponse = await pinJSONToIPFS(metadata);
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        };
    }
    const tokenURI = pinataResponse.pinataUrl;

    window.contract = await new web3.eth.Contract(contractABI, contractAddress);

    console.log("mintNFT, select address: " + window.ethereum.selectedAddress);
    console.log("mintNFT, startDateInSecs: " + startDateInSecs);
    console.log("mintNFT, EndDateInSecs: " + EndDateInSecs);
    console.log("mintNFT, receipt: " + receipt);
    console.log("mintNFT, tokenURI: " + tokenURI);

    //set up your Ethereum transaction
    const transactionParameters = {
        to: contractAddress,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.mint(window.ethereum.selectedAddress, startDateInSecs, EndDateInSecs, receipt, tokenURI).encodeABI() //make call to NFT smart contract
        //'data': window.contract.methods.mintNFT(window.ethereum.selectedAddress, tokenURI).encodeABI() //make call to NFT smart contract
    };

    //sign the transaction via Metamask
    try {
        const txHash = await window.ethereum
            .request({
                method: 'eth_sendTransaction',
                params: [transactionParameters],
            });
        return {
            success: true,
            status: `✅ Check out your transaction on Etherscan: https://sepolia.etherscan.io/tx/${txHash}`,
            imageurl: metadata.image 
        };
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        };

    }

}