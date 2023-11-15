const sendRequest = async (req, res) => {
    try {
        const rpcUrl = 'https://api.jagrat.hypersign.id/hypersign-protocol/hidnode/ssi/did/';
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
        res.send(limitedDidDoc);
    } catch (error) {
        console.error('Error calling RPC:', error.message);
        res.status(500).send('Internal Server Error');
    }      
};

export default {
    sendRequest
};
