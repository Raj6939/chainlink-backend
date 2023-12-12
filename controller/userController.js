import fetch from "node-fetch"
import {
  HypersignVerifiablePresentation,
} from 'hs-ssi-sdk';
const sendRequest = async (req, res) => {
  
    try {
        const rpcUrl = 'https://hypersign-testnet-rest.stakerhouse.com/hypersign-protocol/hidnode/ssi/did/';
        const did = req.params.id;
        
        const response = await fetch(`${rpcUrl}${did}`);
        
        if (!response.ok) {
            throw new Error(`RPC request failed with status: ${response.status}`);
        }

        const resolvedDidDoc = await response.json();
        console.log("resolvedDidDoc",resolvedDidDoc)
        console.log('RPC Result:', resolvedDidDoc);
        const didDoc = resolvedDidDoc.didDocument        
        const limitedDidDoc = {
            did: didDoc.id,
            verificationMethods: didDoc.verificationMethod.map(method => ({
              id: method.id,
              type: method.type,
              publicKeyMultibase: method.publicKeyMultibase
            })),
            authenticationMethods: didDoc.authentication,
          };
          console.log(limitedDidDoc)
        res.send({verified:true});
    } catch (error) {
        console.error('Error calling RPC:', error.message);
        res.status(500).send('Internal Server Error');
    }      
};

const verifyVp = async (req, res, next) => {
  try {
    console.log('on try')
    const { presentation } = req.body;

    const holderDid = presentation['holder'];
    const issuerDid = presentation['verifiableCredential'][0]['issuer'];
    const challenge = presentation['proof']['challenge'];
    const hypersignVP = new HypersignVerifiablePresentation({
      nodeRestEndpoint: "https://hypersign-testnet-rest.stakerhouse.com/",
      nodeRpcEndpoint: "https://hypersign-testnet-rpc.stakerhouse.com/",
      namespace: 'testnet',
    });  
    
    console.log("hypersignVP",hypersignVP)
    const verifiedPresentationDetail = await hypersignVP.verify({
      signedPresentation: presentation,
      issuerDid,
      holderDid,
      holderVerificationMethodId: holderDid + '#key-1',
      issuerVerificationMethodId: issuerDid + '#key-1',
      challenge,
    });
    console.log("verifiedPresentationDetail",verifiedPresentationDetail)
    
    res.json(verifiedPresentationDetail)
    
  } catch (error) {
    res.send(error)
  }
}
export default {
    sendRequest,
    verifyVp
};
