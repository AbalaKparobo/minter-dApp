import { pinJSONtoIPFS } from './pinata'
require('dotenv').config()
const { createAlchemyWeb3 } = require('@alch/alchemy-web3')
const contractABI = require('../contract-abi.json')
const freecontractABI = require('./contract-abi.json')

// paid and tokenUri aaddress
const CONTRACT_ADDRESS = '0x3e6B70620BA35C8c8B32a522998407C598f5683a'
const FREE_CONTRACT_ADDRESS = '0xe064CBB800Fd7bD3E4Db8C1ddd238CB2F84762be'
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY
const web3 = createAlchemyWeb3(alchemyKey)


export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_requestAccounts",
            })
            const obj = {
                status: "Conneted to Wallet, Ready to mint?",
                address: addressArray[0],
            }
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
        }
    }
}


export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: "eth_accounts",
            })
            if (addressArray.length > 0) {
                return {
                    address: addressArray[0],
                    status: "Conneted to Wallet, Ready to mint?"
                }
            } else {
                return {
                    address: "",
                    status: "🦊 Connect to Metamask using the top right button.",
                }
            }
        } catch (err) {
            return {
                address: "",
                status: "😥 " + err.message,
              }
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
        }
    }
}

export const mintNFT = async (amount) => {
    // if (amount.trim() == "" || parseInt(amount) > 0) { 
    //     return {
    //         success: false,
    //         status: "❗Please make sure amount field is greater than 0 before minting.",
    //     }
    // }
    const metadata = new Object();
    metadata.name = 'Second Land'
    metadata.image = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaW5ZTWluIG1lZXQnIHZpZXdCb3g9JzAgMCAzNTAgMzUwJz48c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDI0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9J2JsYWNrJyAvPjx0ZXh0IHg9JzUwJScgeT0nNTAlJyBjbGFzcz0nYmFzZScgZG9taW5hbnQtYmFzZWxpbmU9J21pZGRsZScgdGV4dC1hbmNob3I9J21pZGRsZSc+Rmlyc3QgTGFuZCBEb2N1bWVudDwvdGV4dD48L3N2Zz4='
    metadata.description = "Some dummy description for second image";

    const pinataResponse = await pinJSONtoIPFS(metadata)
    console.log("=============================================")
    console.log(pinataResponse)
    if (!pinataResponse.success) {
        return {
            success: false,
            status: "😢 Something went wrong while uploading your tokenURI.",
        }
    }
    const tokenURI = pinataResponse.pinataUrl;
    // const tokenURI = "https://gateway.pinata.cloud/ipfs/QmZKyZxbbDo8tMkJMwaFxo7vnyCbVvFV7khQp9CMBhVvTs"

    window.contract = await new web3.eth.Contract(contractABI, CONTRACT_ADDRESS)

    const transactionParameters = {
        to: CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        gas: web3.utils.toWei('0.0001', 'ether'),
        gasPrice: web3.utils.toWei('0.00000000001', 'ether'),
        value: web3.utils.toWei('0.01', 'ether'),
        'data': window.contract.methods.mintNFT(amount, tokenURI).encodeABI()
    }

    try {
        const txnHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        console.log("+++++++++++======================+++++++++++++++++")
        console.log(txnHash)
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txnHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const mintFreeNFT = async () => {
    const metadata = new Object();
    metadata.name = 'First Land || Free'
    metadata.image = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHByZXNlcnZlQXNwZWN0UmF0aW89J3hNaW5ZTWluIG1lZXQnIHZpZXdCb3g9JzAgMCAzNTAgMzUwJz48c3R5bGU+LmJhc2UgeyBmaWxsOiB3aGl0ZTsgZm9udC1mYW1pbHk6IHNlcmlmOyBmb250LXNpemU6IDI0cHg7IH08L3N0eWxlPjxyZWN0IHdpZHRoPScxMDAlJyBoZWlnaHQ9JzEwMCUnIGZpbGw9J2JsYWNrJyAvPjx0ZXh0IHg9JzUwJScgeT0nNTAlJyBjbGFzcz0nYmFzZScgZG9taW5hbnQtYmFzZWxpbmU9J21pZGRsZScgdGV4dC1hbmNob3I9J21pZGRsZSc+Rmlyc3QgTGFuZCBEb2N1bWVudDwvdGV4dD48L3N2Zz4='
    metadata.description = "Some dummy description -- Free";

    const tokenURI = "https://gateway.pinata.cloud/ipfs/QmZKyZxbbDo8tMkJMwaFxo7vnyCbVvFV7khQp9CMBhVvTs"

    window.contract = await new web3.eth.Contract(freecontractABI, FREE_CONTRACT_ADDRESS)

    const transactionParameters = {
        to: FREE_CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.mintNFT(tokenURI).encodeABI()
    }

    try {
        const txnHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        console.log("+++++++++++======================+++++++++++++++++")
        console.log(txnHash)
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txnHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const setSalesState = async (state) => {
    
    window.contract = await new web3.eth.Contract(freecontractABI, FREE_CONTRACT_ADDRESS)

    const transactionParameters = {
        to: FREE_CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.setSalesState(state).encodeABI()
    }

    try {
        const txnHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        console.log(txnHash)
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txnHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const setWhitelistOnlySalesState = async (state) => {
    
    window.contract = await new web3.eth.Contract(freecontractABI, FREE_CONTRACT_ADDRESS)

    const transactionParameters = {
        to: FREE_CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.setWhiteListeSalesState(state).encodeABI()
    }

    try {
        const txnHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        console.log(txnHash)
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txnHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}

export const setNFTPerAccountLimit = async (limit) => {
    
    window.contract = await new web3.eth.Contract(freecontractABI, FREE_CONTRACT_ADDRESS)

    const transactionParameters = {
        to: FREE_CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.setMaxSupplyPerAddress(limit).encodeABI()
    }

    try {
        const txnHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        console.log(txnHash)
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txnHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}
export const whitelistAddress = async (address) => {
    
    window.contract = await new web3.eth.Contract(freecontractABI, FREE_CONTRACT_ADDRESS)

    const transactionParameters = {
        to: FREE_CONTRACT_ADDRESS,
        from: window.ethereum.selectedAddress,
        'data': window.contract.methods.whitelistAddress([address]).encodeABI()
    }

    try {
        const txnHash = await window.ethereum.request({
            method: 'eth_sendTransaction',
            params: [transactionParameters]
        })
        console.log(txnHash)
        return {
            success: true,
            status: "✅ Check out your transaction on Etherscan: https://rinkeby.etherscan.io/tx/" + txnHash
        }
    } catch (error) {
        return {
            success: false,
            status: "😥 Something went wrong: " + error.message
        }
    }
}