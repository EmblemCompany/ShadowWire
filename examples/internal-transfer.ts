import { ShadowWireClient, RecipientNotFoundError } from '@radr/shadowwire';

async function internalTransferSOL() {
  const client = new ShadowWireClient();

  try {
    const result = await client.transfer({
      sender: 'YOUR_WALLET_ADDRESS',
      recipient: 'RECIPIENT_WALLET_ADDRESS',
      amount: 0.5,
      token: 'SOL',
      type: 'internal',
    });

    console.log('Private internal transfer complete');
    console.log('Transaction signature:', result.tx_signature);
    console.log('Amount hidden:', result.amount_hidden);
    console.log('Proof PDA:', result.proof_pda);
  } catch (error) {
    if (error instanceof RecipientNotFoundError) {
      console.log('Recipient is not a ShadowPay user');
      console.log('Try using external transfer instead');
    } else {
      throw error;
    }
  }
}

async function internalTransferORE() {
  const client = new ShadowWireClient();

  const result = await client.transfer({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'RECIPIENT_WALLET_ADDRESS',
    amount: 1000,
    token: 'ORE',
    type: 'internal',
  });

  console.log('ORE private transfer complete');
  console.log('TX:', result.tx_signature);
  console.log('Amount is completely hidden on-chain');
}

async function privateBusinessPayment() {
  const client = new ShadowWireClient();

  const result = await client.transfer({
    sender: 'YOUR_WALLET_ADDRESS',
    recipient: 'BUSINESS_WALLET_ADDRESS',
    amount: 5000,
    token: 'USDC',
    type: 'internal',
  });

  console.log('Private business payment sent');
  console.log('Transaction:', result.tx_signature);
  console.log('Payment amount is private');
}

async function internalTransferWithFallback() {
  const client = new ShadowWireClient();

  const recipientAddress = 'RECIPIENT_WALLET_ADDRESS';
  const amount = 0.25;
  const token = 'SOL';

  try {
    const result = await client.transfer({
      sender: 'YOUR_WALLET_ADDRESS',
      recipient: recipientAddress,
      amount: amount,
      token: token,
      type: 'internal',
    });

    console.log('Private transfer successful');
    console.log('TX:', result.tx_signature);
  } catch (error) {
    if (error instanceof RecipientNotFoundError) {
      console.log('Recipient not in ShadowPay, switching to external transfer');
      
      const result = await client.transfer({
        sender: 'YOUR_WALLET_ADDRESS',
        recipient: recipientAddress,
        amount: amount,
        token: token,
        type: 'external',
      });

      console.log('External transfer successful');
      console.log('TX:', result.tx_signature);
    } else {
      throw error;
    }
  }
}

internalTransferSOL().catch(console.error);

