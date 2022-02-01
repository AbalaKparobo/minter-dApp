const axios = require('axios')

require('dotenv').config()
const key = process.env.REACT_APP_PINATA_KEY
const secret = process.env.REACT_APP_PINATA_SECRET

export const pinJSONtoIPFS = async (JSONBody) => {
    const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`
    
    return axios.post(url, JSONBody, {
        headers: {
            pinata_api_key: key,
            pinata_secret_api_key: secret,
        }
    }).then(response => {
        return {
            success: true,
            pinataUrl: "https://gateway.pinata.cloud/ipfs/" + response.data.IpfsHash
        }
    }).catch(err => {
        return {
            sucess: false,
            message: err.message,
        }
    })
}
