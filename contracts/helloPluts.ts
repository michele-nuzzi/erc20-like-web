import { Address, PScriptContext, PaymentCredentials, Script, bool, compile, data, makeValidator, pBool, pfn } from "@harmoniclabs/plu-ts";


const helloPluts = pfn([
    data,
    data,
    PScriptContext.type
], bool)
(( datum, redeemer, ctx ) => {

    // locks founds forever
    return pBool( false );
});

///////////////////////////////////////////////////////////////////
// ------------------------------------------------------------- //
// ------------------------- utilities ------------------------- //
// ------------------------------------------------------------- //
///////////////////////////////////////////////////////////////////

export const untypedValidator = makeValidator( helloPluts );

export const compiledContract = compile( untypedValidator );

export const script = new Script(
    "PlutusScriptV2",
    compiledContract
);

export const scriptTestnetAddr = new Address(
    "testnet",
    PaymentCredentials.script( script.hash )
);