import { Address, PrivateKey, dataToCbor, Value, DataConstr, PaymentCredentials, pDataI, pDataB, PCredential, pData, Tx, DataI, DataB, eqData } from "@harmoniclabs/plu-ts";
import { readFile } from "fs";
import { blockfrost } from "./blockfrost";
import getTxBuilder from "./getTxBuilder";
import { BrowserWallet } from "@meshsdk/core";
import { accountFactory, accountManager, managerTestnetAddr } from "./consts";
import { toPlutsUtxo } from "./mesh-utils";
import { sha2_256 } from "@harmoniclabs/crypto";


async function getTx( wallet: BrowserWallet ): Promise<Tx>
{
    const txBuilder = await getTxBuilder();

    const utxos = (await wallet.getUtxos()).map( toPlutsUtxo );
    const utxo = utxos.find( u => u.resolved.value.lovelaces >= 5_200_000 );

    if( !utxo ) throw new Error("couldn't find utxo");

    const myAddr = utxo.resolved.address;

    const expectedAssetName = new Uint8Array(
        sha2_256(
            dataToCbor( utxo.utxoRef.toData() ).toBuffer()
        )
    );

    const contractUtxos = await blockfrost.addressUtxos( managerTestnetAddr );
    const myAccountUtxo = contractUtxos.find( u => 
        ( u.resolved.datum instanceof DataConstr ) &&
        u.resolved.value.lovelaces >= 10_000_000 &&
        eqData( 
            u.resolved.datum.fields[0],
            new DataI( 0 )
        ) &&
        eqData( 
            u.resolved.datum.fields[1],
            myAddr.paymentCreds.toData()
        ) && (
            u.resolved.datum.fields[3] instanceof DataConstr &&
            u.resolved.datum.fields[3].constr === BigInt(0) // state === ok
        )
    );

    if( !myAccountUtxo )
    {
        console.log(
            JSON.stringify(
                contractUtxos.map( u => u.toJson() ),
                undefined,
                2
            )
        );
        throw new Error("missing");
    }

    const mintAmt = BigInt( 10_000 );
    const inputErc20Qty = ((myAccountUtxo.resolved.datum as DataConstr).fields[0] as DataI).int;
    const state = (myAccountUtxo.resolved.datum as DataConstr).fields[3];

    const tx = txBuilder.buildSync({
        inputs: [
            {
                utxo: myAccountUtxo,
                inputScript: {
                    script: accountManager,
                    datum: "inline",
                    redeemer: new DataConstr( 0, [ new DataI( mintAmt ) ] )
                }
            },
            { utxo }
        ],
        collaterals: [ utxo ],
        collateralReturn: {
            address: utxo.resolved.address,
            value: Value.sub(
                utxo.resolved.value,
                Value.lovelaces( 10_000_000 )
            )
        },
        outputs: [
            {
                address: managerTestnetAddr,
                value: myAccountUtxo.resolved.value,
                datum: new DataConstr(
                    0,
                    [
                        new DataI( inputErc20Qty + mintAmt ),
                        myAddr.paymentCreds.toData(),
                        new DataB( accountFactory.hash.toBuffer() ),
                        state
                    ]
                )
            }
        ],
        changeAddress: myAddr
    });

    return tx;
}

export async function mintErc20( wallet: BrowserWallet ): Promise<string>
{
    const unsingedTx = await getTx( wallet );

    const txStr = await wallet.signTx(
        unsingedTx.toCbor().toString(),
        true // partial sign because we have smart contracts in the transaction
    );

    return (await blockfrost.submitTx( Tx.fromCbor( txStr ) )).toString();
}