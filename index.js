import { PrivateKey } from "@hashgraph/sdk";
import fetch from 'node-fetch';
import { createWriteStream, existsSync } from 'fs';
import rl from 'readline-sync';

let filename = 'generated.csv';
let i = 2;

while(existsSync(filename)) {
    filename = `generated_${i}.csv`;
    i++;
}

let writeStream = createWriteStream(`./${filename}`);

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

const main = async () => {

    const numberToGenerate = rl.question('[?] How Many Wallet: ')
    console.log("Generating Wallet....")

    writeStream.write('Account ID,Private Key\n');
    for(let i = 0; i < numberToGenerate; i++) {
        const newAccountPrivateKey = PrivateKey.generateED25519();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;

        const wallet = await createWallet(newAccountPublicKey.toStringDer())
        const sukses = wallet.receipt.status._code = 22
        const accountid = wallet.accountID

        if(!sukses) return;
        console.log(newAccountPrivateKey.toStringDer())
        writeStream.write(`${accountid},${newAccountPrivateKey}${i + 1 == numberToGenerate ? '' : '\n'}`)
    }  
}

main()