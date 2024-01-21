import { Address, PrivateKey, dataToCbor, Value, DataConstr, PaymentCredentials, pDataI, pDataB, PCredential, pData, Tx, DataI, DataB } from "@harmoniclabs/plu-ts";
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

    const expectedAssetName = new Uint8Array(
        sha2_256(
            dataToCbor( utxo.utxoRef.toData() ).toBuffer()
        )
    );

    const myAddr = utxo.resolved.address;

    const tx = txBuilder.buildSync({
        inputs: [
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
        mints: [
            {
                value: Value.singleAsset( accountFactory.hash, expectedAssetName, 1 ),
                script: {
                    inline: accountFactory,
                    policyId: accountFactory.hash,
                    redeemer: new DataConstr(0,[])
                }
            }
        ],
        outputs: [
            {
                address: managerTestnetAddr,
                value: new Value([
                    Value.lovelaceEntry( 5_000_000 ),
                    Value.singleAssetEntry( accountFactory.hash, expectedAssetName, 1 )
                ]),
                datum: new DataConstr(
                    0, [
                        new DataI( 0 ),
                        myAddr.paymentCreds.toData(),
                        new DataB( accountFactory.hash.toBuffer() ),
                        new DataConstr(0,[])
                    ]
                )
            }
        ],
        changeAddress: myAddr
    });

    return tx;
}

export async function createAccountTx( wallet: BrowserWallet ): Promise<string>
{
    const unsingedTx = await getCreateAccountTx( wallet );

    const txStr = await wallet.signTx(
        unsingedTx.toCbor().toString(),
        true // partial sign because we have smart contracts in the transaction
    );

    return (await blockfrost.submitTx( Tx.fromCbor( txStr ) )).toString();
}