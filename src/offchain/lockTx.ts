import { Tx } from "@harmoniclabs/plu-ts";
import { BrowserWallet } from "@meshsdk/core";
import koios from "./koios";

async function getLockTx( wallet: BrowserWallet ): Promise<Tx>
{
    throw "'lockTx' logic not implemented";
}

export async function lockTx( wallet: BrowserWallet): Promise<string>
{
    const unsingedTx = await getLockTx( wallet );

    const txStr = await wallet.signTx(
        unsingedTx.toCbor().toString()
    );

    return (await koios.tx.submit( Tx.fromCbor( txStr ) as any )).toString();
}
