import { Address, PrivateKey, dataToCbor, Value, DataConstr, PaymentCredentials, pDataI, pDataB, PCredential, pData, Tx, DataI, DataB, eqData } from "@harmoniclabs/plu-ts";
import { readFile } from "fs";
import { blockfrost } from "./blockfrost";
import getTxBuilder from "./getTxBuilder";
import { BrowserWallet } from "@meshsdk/core";
import { accountFactory, accountManager, managerTestnetAddr } from "./consts";
import { toPlutsUtxo } from "./mesh-utils";
import { sha2_256 } from "@harmoniclabs/crypto";


async function getCreateAccountTx( wallet: BrowserWallet ): Promise<Tx>
{
    const txBuilder = await getTxBuilder();

    const utxos = (await wallet.getUtxos()).map( toPlutsUtxo );
    const utxo = utxos.find( u => u.resolved.value.lovelaces >= 10_200_000 );

    if( !utxo ) throw new Error("couldn't find utxo");

    const myAddr = Address.fromString( (await wallet.getUsedAddresses())[0] );

    const contractUtxos = await blockfrost.addressUtxos( managerTestnetAddr );
    
    const amtSent = BigInt( 100 );

    const myAccountUtxos = contractUtxos.filter( u => 
        ( u.resolved.datum instanceof DataConstr ) &&
        eqData( 
            u.resolved.datum.fields[1],
            myAddr.paymentCreds.toData()
        ) && (
            u.resolved.datum.fields[0] instanceof DataI && // amount
            u.resolved.datum.fields[0].int >= amtSent
        )
    );
    if( myAccountUtxos.length < 2 ) {
        console.log( contractUtxos );
        console.log( myAccountUtxos );
        throw new Error("missing myAccountUtxos")
    };

    const [ myAccountUtxo, sndAccountUtxo ] = myAccountUtxos;

    const initialReceiverAmt = ((sndAccountUtxo.resolved.datum as DataConstr).fields[0] as DataI).int
    const inputErc20Qty = ((myAccountUtxo.resolved.datum as DataConstr).fields[0] as DataI).int;
    const change = inputErc20Qty - amtSent;

    const tx = txBuilder.buildSync({
        inputs: [
            {
                utxo: myAccountUtxo,
                inputScript: {
                    script: accountManager,
                    datum: "inline",
                    redeemer: new DataConstr(
                        1, // Transfer
                        [
                            // to
                            myAddr.paymentCreds.toData(),
                            // amount
                            new DataI( amtSent )
                        ]
                    )
                }
            },
            {
                utxo: sndAccountUtxo,
                inputScript: {
                    script: accountManager,
                    datum: "inline",
                    redeemer: new DataConstr(2, []) // Receive
                }
            }
        ],
        collaterals: [ utxo ],
        outputs: [
            {
                address: managerTestnetAddr,
                value: myAccountUtxo.resolved.value,
                datum: new DataConstr(
                    0, [
                        new DataI( change ),
                        myAddr.paymentCreds.toData(),
                        new DataB( accountFactory.hash.toBuffer() ),
                        (myAccountUtxo.resolved.datum as DataConstr).fields[3]
                    ]
                )
            }
        ],
        requiredSigners: [ myAddr.paymentCreds.hash ],
        change: {
            address: managerTestnetAddr,
            datum: new DataConstr(
                0, [
                    new DataI( initialReceiverAmt + amtSent ),
                    myAddr.paymentCreds.toData(),
                    new DataB( accountFactory.hash.toBuffer() ),
                    (sndAccountUtxo.resolved.datum as DataConstr).fields[3]
                ]
            )
        }
    });
    
    return tx;
}

export async function transferTx( wallet: BrowserWallet ): Promise<string>
{
    const unsingedTx = await getCreateAccountTx( wallet );

    const txStr = await wallet.signTx(
        unsingedTx.toCbor().toString(),
        true // partial sign because we have smart contracts in the transaction
    );

    return (await blockfrost.submitTx( Tx.fromCbor( txStr ) )).toString();
}