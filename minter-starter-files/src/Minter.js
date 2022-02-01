import { useEffect, useState } from "react";
import { connectWallet, getCurrentWalletConnected, mintNFT,
   mintFreeNFT, setSalesState, setWhitelistOnlySalesState, 
   setNFTPerAccountLimit, whitelistAddress } from './utils/interact'

const Minter = (props) => {

  //State variables
  const [walletAddress, setWallet] = useState("");
  const [status, setStatus] = useState("");
  const [perAccountLimit, setPerAccountLimit] = useState(0)
  const [addressToWL, setAddressToWL] = useState('')
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  // const [url, setURL] = useState("");
 
  useEffect(async () => { //TODO: implement
    const {address, status} = await getCurrentWalletConnected()
    setWallet(address)
    setStatus(status)

    addWalletListener()
  }, []);

  const connectWalletPressed = async () => { //TODO: implement
    const walletResponse = await connectWallet()
    setStatus(walletResponse.status)
    setWallet(walletResponse.address)
  };

  const onMintPressed = async () => { //TODO: implement
    const { status } = await mintNFT(1)
    setStatus(status)
  };

  const onFreeMintPressed = async () => {
    console.log("Will mint FREE contract")
    const { status } = await mintFreeNFT()
    setStatus(status)
  }

  const setSalesClicked = async (selling) => {
    const { status } = await setSalesState(selling)
    setStatus(status)
  }

  const setWhiteListOnlySaleClicked = async (selling) => {
    const { status } = await setWhitelistOnlySalesState(selling)
    setStatus(status)
  }

  const setNFTLimit = async (limit) => {
    const { status } = await setNFTPerAccountLimit(limit)
    setStatus(status)
    setPerAccountLimit(0)
  }

  const whitelistAddressClicked = async (address) => {
    const { status } = await whitelistAddress(address)
    setStatus(status)
    setAddressToWL("")
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", accounts => {
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setStatus("Conneted to Wallet, Ready to mint?")
        } else {
          setWallet("")
          setStatus("🦊 Connect to Metamask using the top right button.")
        }
      })
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
      )
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
      <h1 id="title">🧙‍♂️ Demo NFT Minter</h1>
      {/* <p>
        Simply add your asset's link, name, and description, then press "Mint."
      </p> */}
      {/* <form> */}
        {/* <h2>🖼 Link to asset: </h2>
        <input
          type="text"
          placeholder="e.g. https://gateway.pinata.cloud/ipfs/<hash>"
          onChange={(event) => setURL(event.target.value)}
        /> */}
        {/* <h2>🤔 Name: </h2>
        <input
          type="text"
          placeholder="e.g. My first NFT!"
          onChange={(event) => setName(event.target.value)}
        /> */}
        {/* <h2>✍️ Description: </h2>
        <input
          type="text"
          placeholder="e.g. Even cooler than cryptokitties ;)"
          onChange={(event) => setDescription(event.target.value)}
        /> */}
      {/* </form> */}

      <p id="margin-box"></p>
      <button id="mintButton" onClick={onMintPressed}>
        Mint NFT
      </button>
      <br />
      <p id="margin-box"></p>
      <button id="freeMintButton" onClick={onFreeMintPressed}>
        Mint Free NFT
      </button>
      <p id="status">
        {status}
      </p>
      <p id="margin-box"></p>
      <div>
        <div><button onClick={() => setSalesClicked(true)} className="cta-button toggle-sales">Enable Sale</button></div>
        <div><button onClick={() => setSalesClicked(false)} className="cta-button toggle-sales">Disable Sale</button></div>
      </div>

      <p id="margin-box"></p>
      <div>
        <div><button onClick={() => setWhiteListOnlySaleClicked(true)} className="cta-button toggle-whitelist-sales">Enable WhiteList Only Sale</button></div>
        <div><button onClick={() => setWhiteListOnlySaleClicked(false)} className="cta-button toggle-whitelist-sales">Disable hiteList Only Sale</button></div>
      </div>
      <p id="margin-box"></p>
      <div className="limit-div">
          <input value={perAccountLimit} onChange={e => setPerAccountLimit(e.target.value)} className="limit-input" type="number"/>
          <button onClick={() => {setNFTLimit(perAccountLimit)}} className="cta-button btn-limit">set limit</button>
        </div>
        <p id="margin-box"></p>
        <div className="limit-div">
          <input value={addressToWL} onChange={e => setAddressToWL(e.target.value)} className="limit-input"/>
          <button onClick={() => {whitelistAddressClicked(addressToWL)}} className="cta-button btn-limit">Whitelist Above Address</button>
        </div>
    </div>
    
  );
};

export default Minter;
