import { Address, PaymentCredentials, Script } from "@harmoniclabs/plu-ts";
import { fromHex } from "@harmoniclabs/uint8array-utils";

export const accountManager =  new Script(
    "PlutusScriptV2",
    fromHex(
        "010000323232323232323232323232323232323232323232323232323232222323232323232323232323232323232323232323232323232533357340022930b19999981a80c919191919191981d1981d1981d1981d1981d1981d1981d1aba33574400826ae8cd5d10028981980189aba33303101700e13303a3370e01a9001099b8700c480084cdc39998181bab303500201800f480084cc0e8cc0e8cdc38051bad35742002266ebc064c0d40044cdc780c1bae302f00113375e605c0026ae84018c0ccc8cccc0b4c0bc0088d5d08008008009318190009aba1002330270040113302600400226232323303733037330373370e6066002900209981b99b8700a480084cdc3804a400426604c466e1d200233302e37566066606400202c01200426604c466070646666604e6aae740080040048c8cdd79aba100235742606aa666ae68cdd79aba130350010171357426ae880144004d5d0802000925013233333303a35573c004002002002466e212000375a606a0020024c0306604e0080226604c0080044646464646464646464646466080660806608066080660806608066080660806608066080660806608066e1cc0f0029200413370e6078016900209991981f10a512223304430040021300300103900b1335738921003302f233041323333303035573a004002002466ebcd5d08009aba100600124a02646666660866aae78008004004928800800925002113371200202026ae8ccc0dc0740504cc100cdc3809a4004266e1c049200213370e66606c6eacc0ecc0e8d5d0a999ab9a3370e6601003c02a90010805899aba000733574001206403c02a900109981619ab9c491000263357389210000613302c0020051330403370e6eb4d5d0981d00319b8101000113370e6eb4d5d0981d00299b80375a6ae84c0e80080044ccc0ac07c8cc0c08ccc0b4d5d0981e1aba1303c303d303c00123371e6eb8d5d08009bae3574200649400708ccc888cc0ccc00c004009c7999199181d91aba030020010014bd623ae3758646ae84d5d11aba2357446ae88d5d11aba2357446ae8800408cdd71aba100113302d14910666726f7a656e003370e6aae74dd5181a010240006eb4c0e802cc0a0c0e4004c0dd4ccd5cd19baf35742606e00203226ae84d5d100388009aba10063025357426ae894ccd5cd19b87330030190104800840184cd5d000119aba000402d302435742a666ae68cdc39980100c007a4004200a266ae80004cd5d00018161aba135744008605c6eacc0ccc0c8004d5d080119813802008998130020011191919191981c9981c9981c9981c9981c9981c9aba33574400626ae8ccc0c00580344cc0e4cdc380624004266e1c02d20021357466ae880104c0c80044cdc4a4000004264646466078660786607866e1cc0e000920021323303d3371e6eb8d55ce800807099b87375a6aae7800520023574200426644646466080660806605a2921056372656473003375e6076004607600226605a29201076375727253796d003371e6eb8c0d4008dd7181a8008998168a49057374617465003375e6068004606800260720046070004044002266e1cdd69aba1303600100532333302f30310032357420020020024c60246eacc0d4004c0cc004d5d080199b80007375a6ae8400ccc09c010044cc098010008dd6181400a9180118171816800991191981a19baf35742605c6ae8400400c4cc08c8cdc79bae35573a0020266eacc0bc004c0b4004d5d098159aba100b375a6ae84040dd71aab9d357426466603666644606244a666ae68d5d1800880e8992999ab9a300400113374a900019aba0300500102713003357440046ae84004060034024988dd59aab9e3018357420020106eb4d55cf00218148021bab32357426ae88d5d11aba23574400201c6eb8d55ce8009aba10013001002233301433322302a22533357346ae8c00440584c94ccd5cd1802000899ba548000cd5d01802800810098019aba20023574200202200c0044c46eacd55cf18089aba100137566044002604066602266644604e44a666ae68d5d180088098992999ab9a300400113374a900019aba0300500101d13003357440046ae8400480048cdd79aba1302100100300126230223021357420026eb0d5d08039919999809981000400080091aba10010012623371e6eb8d55ce8008011bae3017002301c001301a0063756646ae84d5d11aba2357446ae88d5d11aba2357446ae88d5d1000800980c1aba10013017001232337606ae84004d5d09aba2001375800246e9ccd5d01aab9d0013357406aae7800402d30103d87a8000232333300b300d30120022357420020020024c44464664a666ae68c005200010031533357346002900108020b1b8735573a0026aae78004dd50019119191980c1980c198028a49056372656473003375e6026004602600226600a29201076375727253796d003371e6eb8c034008dd718068008998028a49057374617465003375e601800460180026022004602000444a666ae68004528899ab9c50024a04444464664a666ae68c005200010031533357346002900108020a999ab9a300148010401454ccd5cd1800a400c200c2c6e1cd55ce8009aab9e001375400a46601e42940888cc014c0100084c00c004894ccd5cd0010a5100123300822533357346006004266ae800080044004008dd8a4c444464664a666ae68c005200010031533357346002900108020a999ab9a300148010401458dc39aab9d00135573c0026ea80108d5d09aba2357446ae880048d5d09aba2357440024446660144290001112999ab9a3371e646eb8d55ce800801002899980690a4000444a666ae68cdc79bae35573a00400e26eb4d55cf001098018009bab35573c0042600600200646600444a666ae68c00c0084cd5d000100088009bb249888cc01c84008888cc014008c00c0048cdc398021bab30033002001480108d55cf1baa0012357426ae88004cc0048520002223370090011801800980111111919980318020009801800801198020018011112999aab9f001003133002357420026ae880048c8c0088cc0080080048c0088cc008008004894ccd5cd0010008a5022222232332533357346002900008018a999ab9a300148008401054ccd5cd1800a4008200a2a666ae68c005200610061533357346002900408038b1b8735573a0026aae78004dd500301"
    )
);

export const managerTestnetAddr = Address.testnet( PaymentCredentials.script( accountManager.hash ) )
export const managerMainnetAddr = Address.mainnet( PaymentCredentials.script( accountManager.hash ) )

export const accountFactory = new Script(
    "PlutusScriptV2",
    fromHex(
        "01000032323232323232323232323232223232323232533357340022930b199809803119807919912999ab9a00214a2002601e66e3cdd71aab9d0010051330102337106eb4d55cf000a40006eacd55cf00080111919191919191980b1980b1980b1aba33574400626602a4602a66e3cdd71aab9d00100b3756602600226602c6602c6ae8cd5d1003099b8f00437246eccd5d0801099b87375a6aae7801520021323233018330183301833301c3574260286ae840088cdc79bae357420020224c266e1cccc888ccc0708520002225333573466e3cc8dd71aab9d001002005133301f21480008894ccd5cd19b8f375c6aae7400801c4dd69aab9e0021300300137566aae780084c00c00400c004030019200213370e66603242900011119b8048008c00c00400520041323333222232332533357346002900008018a999ab9a300148008401054ccd5cd1800a4008200a2c6e1cd55ce8009aab9e00137540086028006466ebcd5d080099ba548000cd5d026010100003357406ae84c058d5d080299aba0375201c97ae10103d8798000000800931bab30140013012357426eb0c044024c044c048004c040d5d08009bac3574200c6eb8d55ce8009aba100133301433322301522533357346ae8c00440384c94ccd5cd1802000899ba548000cd5d01802800807098019aba20023574200246e9ccd5d01aab9d0013357406aae780040288cdc79bae35573a00200a0044c46eacd55cf191919bb0357420026ae84d5d10009bac001357420026eacc8d5d09aba2357446ae88d5d100080098049aba100232333332222232332533357346002900008018a999ab9a300148008401054ccd5cd1800a4008200a2a666ae68c0052006100616370e6aae74004d55cf0009baa005300a0020010010012375c6ae8400498c01c0052211c0043a6ebafb1378b8cecfa340af93487b06dd9c2524fade40f125ad000376293260103d87a80002357426ae88d5d100091aab9e375400246ae84d5d10009199ab9a0014a09448cc00c852891119802980200109801800912999ab9a00200114a0600444446466600c6008002600600200466008006004444a666aae7c00400c4cc008d5d08009aba200123230022330020020012300223300200200122232332533357346002900008018a999ab9a300148008401058dc39aab9d00135573c0026ea800d"
    )
);