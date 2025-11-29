import { ShadowWireClient } from '@radr/shadowwire';

async function depositSOL() {
  const client = new ShadowWireClient();

  const depositTx = await client.deposit({
    wallet: 'YOUR_WALLET_ADDRESS',
    amount: 100000000,
  });

  console.log('Deposit transaction created');
  console.log('Pool address:', depositTx.pool_address);
  console.log('User balance PDA:', depositTx.user_balance_pda);
  console.log('Amount:', depositTx.amount);
  console.log('\nSign this transaction with your wallet:');
  console.log(depositTx.unsigned_tx_base64);
}

async function depositUSDC() {
  const client = new ShadowWireClient();

  const depositTx = await client.deposit({
    wallet: 'YOUR_WALLET_ADDRESS',
    amount: 100000000,
    token_mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  });

  console.log('USDC deposit transaction created');
  console.log('Sign this transaction:', depositTx.unsigned_tx_base64);
}

async function checkBalanceAfterDeposit() {
  const client = new ShadowWireClient();

  const balance = await client.getBalance('YOUR_WALLET_ADDRESS', 'SOL');
  
  console.log('Pool Balance:');
  console.log('  Available:', balance.available / 1e9, 'SOL');
  console.log('  Deposited:', balance.deposited / 1e9, 'SOL');
  console.log('  Pool Address:', balance.pool_address);
}

depositSOL().catch(console.error);

