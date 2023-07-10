import { PrivateKey } from "@hashgraph/sdk";
import fetch from 'node-fetch';

async function createWallet(pubKey){
    const res = await fetch('https://api-lb.hashpack.app/create-wallet',{
        method: "POST",
        headers:{
            "accept": "*/*",
            "accept-language": "en-US,en;q=0.9",
            "content-type": "application/json",
            "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": "\"Windows\"",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "none",
        },
        body:JSON.stringify(
            {
                "pub_key": pubKey,
                "network": "mainnet",
                "stakeNode": null
            }
        )
    })

    return res.json()
}

(async()=>{
    // generate privetekey and pubkey
    const newAccountPrivateKey = PrivateKey.generateED25519();
    const newAccountPublicKey = newAccountPrivateKey.publicKey;
    
    //creating a new wallet 
    const wallet = await createWallet(newAccountPublicKey.toStringDer())
    const sukses = wallet.receipt.status._code = 22
    const accountid = wallet.accountID

    if(!sukses) return;
    
    console.log("Success Create Wallet\n")
    console.log(`Account ID: ${accountid}\nPrivate Key: ${newAccountPrivateKey}`)
    
})()