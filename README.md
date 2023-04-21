# 🗃 nft-react-webapp - Mint your NFT

* React app with any preferred React framework can be used
* Web3 integration with web3.js or ether.js
* Collect user input e.g. NRIC
* Interact with Smart contract by Claim (mint) NFT with the connected wallet and Receipt (refer to 3.i)
* The App should display the NFT image from NFT metadata
* The necessary error handlings to be developed

<h2> Setup </h2>

* Create a full stack WebApp by connecting smart contract to the React frontend using Metamask and Web3 tools
* A frontend UI where can user input a NRIC number, link to your digital asset, it will do following to mint NFT
    * Connect to Metamask via frontend webapp
    * Send NRIC and Wallet Address to GO API, store it in DB and produce Receipt based on request body hashing
    * Call smart contract methods from frontend with start date, end date, wallet address, receipt value and tokeURI based on NFT metadata (name, image and   
      description)
    * Sign transactions using Metamask
    
<h2> Config </h2>

* Update  "Contract Address" from deployed smart contract and update it to "REACT_APP_CONTRACT_ADDRESS" .env configuration
* All other configurations are default

<h2> Run the WebApp </h2>

<h3> Get packages </h3>

* $ npm install![image](https://user-images.githubusercontent.com/88041827/233533559-272ca187-9a5e-48a4-8aca-2a9f151a69e3.png)

<h3> Run the following commands to start WebApp </h3>

* $ npm start![image](https://user-images.githubusercontent.com/88041827/233533626-a811692a-4cb2-4351-b1dc-33f1e14d52a4.png)

<h2> Mint NFT on WebApp </h2>

<h3> Home Page </h3>

* Input NRIC and Asset link (refer below pinata links) and click on "Mint NFT" button, it will open MetaMask to sign on the transactions

![image](https://user-images.githubusercontent.com/88041827/233534105-33660625-4b76-48ca-9632-90f2c7c9905c.png)


<h3> Pinata IFPS file links for testing </h3>

https://gateway.pinata.cloud/ipfs/QmP8czR5h79R6CjXA7uqkme3BuDxWMCczWWdYMdTkjyn76
https://gateway.pinata.cloud/ipfs/QmPzgTMWEzeFY7XgGtraDF3Xo94aDtzEBR7dyz7cGPCcms
https://gateway.pinata.cloud/ipfs/QmUnMZ4qCEvBsptWpea6rNkVzdBauWtB5QsaqmLHbkFa7S
https://gateway.pinata.cloud/ipfs/QmeBDCqvPS5v3iKAwcNJuwMdVJBcvHrGAy5CtZXfuwuN3o
https://gateway.pinata.cloud/ipfs/QmdtDk8GQdE5Y2PrdmDVjHGUkgQZ6KiaBHrHHuAQFswYVB

<h3> Alchemy App  </h3>

![image](https://user-images.githubusercontent.com/88041827/233534982-5f748f8a-70ab-49e4-99dd-5c3e00340354.png)

<h3> Reference  </h3>

https://www.web3.university/tracks/build-your-first-nft/building-a-full-stack-nft-dapp


