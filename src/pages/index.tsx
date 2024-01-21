import { Button, useToast } from "@chakra-ui/react";
import { useNetwork, useWallet } from "@meshsdk/react";

import style from "../styles/Home.module.css";
import ConnectionHandler from "../components/ConnectionHandler";
import { createAccountTx } from "@/offchain/createAccountTx";
import { mintErc20 } from "@/offchain/mintErc20";
import { transferTx } from "@/offchain/transferTx";

export default function Home()
{
    const { wallet, connected } = useWallet();
    const network = useNetwork();
    const toast = useToast();

    if( typeof network === "number" && network !== 0 )
    {
        return (
            <div className={[
                style.pageContainer,
                "center-child-flex-even"
            ].join(" ")}
            >
                <b style={{
                    margin: "auto 10vw"
                }}>
                    Make sure to set your wallet in testnet mode;<br/>
                    We are playing with founds here!
                </b>
                <Button
                onClick={() => window.location.reload()}
                style={{
                    margin: "auto 10vw"
                }}
                >Refersh page</Button>
            </div>
        )
    }

    function handleTx( getTx: Promise<string> )
    {
        getTx
        .then( txHash => toast({
            title: `tx submitted: https://preview.cardanoscan.io/transaction/${txHash}`,
            status: "success"
        }))
        .catch( e => {
            toast({
                title: `something went wrong`,
                status: "error"
            });
            console.error( e )
        });
    }

    function onCreateAccount()
    {
        handleTx( createAccountTx( wallet ) );
    }
    function onMintErc20()
    {
        handleTx( mintErc20( wallet ) );
    }
    function onTransfer()
    {
        handleTx( transferTx( wallet ) );
    }
    function onChangeState()
    {
        handleTx( mintErc20( wallet ) );
    }

    return (
        <div className={[
            style.pageContainer,
            "center-child-flex-even"
        ].join(" ")} >
            <ConnectionHandler />
            {
                connected &&
                <>
                <Button onClick={onCreateAccount} >Create Account</Button>
                <Button onClick={onMintErc20} >Mint Erc20</Button>
                <Button onClick={onTransfer} >Transfer</Button>
                </>
            }
        </div>
    )
}