import { ShadowWireClient } from '@radr/shadowwire';

async function withdrawSOL() {
  const client = new ShadowWireClient();

  const balance = await client.getBalance('YOUR_WALLET_ADDRESS', 'SOL');
  console.log('Current balance:', balance.available / 1e9, 'SOL');

  const withdrawTx = await client.withdraw({
    wallet: 'YOUR_WALLET_ADDRESS',
    amount: 50000000,
  });

  console.log('Withdrawal transaction created');
  console.log('Amount withdrawn:', withdrawTx.amount_withdrawn / 1e9, 'SOL');
  console.log('Fee:', withdrawTx.fee / 1e9, 'SOL');
  console.log('\nSign this transaction with your wallet:');
  console.log(withdrawTx.unsigned_tx_base64);
}

async function withdrawUSDC() {
  const client = new ShadowWireClient();

  const withdrawTx = await client.withdraw({
    wallet: 'YOUR_WALLET_ADDRESS',
    amount: 50000000,
    token_mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  });

  console.log('USDC withdrawal transaction created');
  console.log('Amount:', withdrawTx.amount_withdrawn / 1e6, 'USDC');
  console.log('Sign this transaction:', withdrawTx.unsigned_tx_base64);
}

async function withdrawAllFunds() {
  const client = new ShadowWireClient();

  const balance = await client.getBalance('YOUR_WALLET_ADDRESS', 'SOL');
  
  if (balance.available === 0) {
    console.log('No funds available to withdraw');
    return;
  }

  const withdrawTx = await client.withdraw({
    wallet: 'YOUR_WALLET_ADDRESS',
    amount: balance.available,
  });

  console.log('Withdrawing all available funds');
  console.log('Amount:', withdrawTx.amount_withdrawn / 1e9, 'SOL');
  console.log('Sign transaction:', withdrawTx.unsigned_tx_base64);
}

withdrawSOL().catch(console.error);

