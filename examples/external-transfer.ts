import { ShadowWireClient } from '@radr/shadowwire';

async function externalTransferSOL() {
  const client = new ShadowWireClient();

  const result = await client.transfer({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: 0.1,
    token: 'SOL',
    type: 'external',
  });

  console.log('External transfer complete');
  console.log('Transaction signature:', result.tx_signature);
  console.log('Amount sent:', result.amount_sent, 'lamports');
  console.log('Amount hidden:', result.amount_hidden);
  console.log('Proof PDA:', result.proof_pda);
}

async function externalTransferUSDC() {
  const client = new ShadowWireClient();

  const result = await client.transfer({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: 100,
    token: 'USDC',
    type: 'external',
  });

  console.log('USDC external transfer complete');
  console.log('TX:', result.tx_signature);
  console.log('Amount sent:', result.amount_sent, 'micro-USDC');
}

async function externalTransferMultipleTokens() {
  const client = new ShadowWireClient();

  const result = await client.transfer({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: 1000,
    token: 'BONK',
    type: 'external',
  });

  console.log('BONK transfer complete');
  console.log('TX:', result.tx_signature);
}

async function transferToAnyWallet() {
  const client = new ShadowWireClient();

  const recipientAddress = 'ANY_SOLANA_WALLET_ADDRESS';

  const result = await client.transfer({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: recipientAddress,
    amount: 0.5,
    token: 'SOL',
    type: 'external',
  });

  console.log(`Sent 0.5 SOL to ${recipientAddress}`);
  console.log('Transaction:', result.tx_signature);
  console.log('The amount is visible on-chain');
}

externalTransferSOL().catch(console.error);
