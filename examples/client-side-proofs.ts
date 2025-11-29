import { 
  ShadowWireClient, 
  initWASM, 
  generateRangeProof, 
  verifyRangeProof,
  isWASMSupported,
  WASMNotSupportedError 
} from '@radr/shadowwire';

async function clientSideProofTransfer() {
  if (!isWASMSupported()) {
    throw new WASMNotSupportedError();
  }

  console.log('Initializing WASM module...');
  await initWASM();
  console.log('WASM initialized');

  const client = new ShadowWireClient();

  const amountSOL = 0.5;
  const amountLamports = amountSOL * 1e9;

  console.log('Generating zero-knowledge proof locally...');
  const startTime = Date.now();
  const proof = await generateRangeProof(amountLamports, 64);
  const endTime = Date.now();
  
  console.log(`Proof generated in ${endTime - startTime}ms`);
  console.log('Proof size:', proof.proofBytes.length / 2, 'bytes');
  console.log('Commitment:', proof.commitmentBytes.substring(0, 16) + '...');

  const result = await client.transferWithClientProofs({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: amountSOL,
    token: 'SOL',
    type: 'internal',
    customProof: proof,
  });

  console.log('Transfer complete with client-side proof');
  console.log('Transaction signature:', result.tx_signature);
}

async function generateAndVerifyProof() {
  if (!isWASMSupported()) {
    console.log('WebAssembly not supported in this environment');
    return;
  }

  await initWASM();

  const amount = 100000000;
  
  console.log('Generating proof for amount:', amount);
  const proof = await generateRangeProof(amount, 64);
  
  console.log('Proof generated successfully');
  console.log('Verifying proof...');
  
  const isValid = await verifyRangeProof(
    proof.proofBytes,
    proof.commitmentBytes,
    64
  );

  console.log('Proof is valid:', isValid);
}

async function maximumPrivacyTransfer() {
  if (!isWASMSupported()) {
    throw new Error('Browser does not support WebAssembly');
  }

  await initWASM();

  const client = new ShadowWireClient({
    debug: true,
  });

  const amountUSDC = 1000;
  const amountMicroUSDC = amountUSDC * 1e6;

  console.log('Generating proof locally for maximum privacy...');
  const proof = await generateRangeProof(amountMicroUSDC, 64);

  const result = await client.transferWithClientProofs({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: amountUSDC,
    token: 'USDC',
    type: 'internal',
    customProof: proof,
  });

  console.log('Maximum privacy transfer complete');
  console.log('TX:', result.tx_signature);
  console.log('Proof was generated locally (backend never saw amount)');
}

async function checkWASMSupport() {
  if (isWASMSupported()) {
    console.log('WebAssembly is supported');
    console.log('You can use client-side proof generation');
    
    try {
      await initWASM();
      console.log('WASM module loaded successfully');
    } catch (error) {
      console.error('Failed to load WASM module:', error);
    }
  } else {
    console.log('WebAssembly is not supported');
    console.log('Use backend proof generation instead');
  }
}

async function preGenerateProof() {
  await initWASM();

  const client = new ShadowWireClient();

  const amount = 0.1;
  
  console.log('Pre-generating proof...');
  const proof = await client.generateProofLocally(amount, 'SOL');
  
  console.log('Proof pre-generated and ready to use');
  console.log('Proof bytes length:', proof.proofBytes.length);

  const result = await client.transferWithClientProofs({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: amount,
    token: 'SOL',
    type: 'internal',
    customProof: proof,
  });

  console.log('Transfer complete with pre-generated proof');
  console.log('TX:', result.tx_signature);
}

clientSideProofTransfer().catch(console.error);
