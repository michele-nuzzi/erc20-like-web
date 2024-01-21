import { ProtocolParamters, TxBuilder, defaultProtocolParameters } from "@harmoniclabs/plu-ts";
import { blockfrost } from "./blockfrost"

/**
 * we don't want to do too many API call if we already have our `txBuilder`
 * 
 * so after the first call we'll store a copy here.
**/
let _cachedTxBuilder: TxBuilder | undefined = undefined

export default async function getTxBuilder(): Promise<TxBuilder>
{
    if(!( _cachedTxBuilder instanceof TxBuilder ))
    {
        try {
            const pp = await blockfrost.getProtocolParameters();

            _cachedTxBuilder = new TxBuilder( pp );
        }
        catch { // just in kase blockfrost returns protocol paramters that don't look good
            // if that happens then use the default protocol paramters
            // !!! IMPORTANT !!! use only as fallback;
            // parameters might (and will) change from the real world
            _cachedTxBuilder = new TxBuilder(
                defaultProtocolParameters
            );
        }
    }

    return _cachedTxBuilder;
}