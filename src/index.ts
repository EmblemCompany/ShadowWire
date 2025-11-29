export { ShadowWireClient } from './client';

export { TokenUtils } from './tokens';

export {
  initWASM,
  generateRangeProof,
  verifyRangeProof,
  isWASMSupported,
} from './zkProofs';

export {
  ShadowWireError,
  InsufficientBalanceError,
  InvalidAddressError,
  InvalidAmountError,
  RecipientNotFoundError,
  ProofUploadError,
  TransferError,
  NetworkError,
  WASMNotSupportedError,
  ProofGenerationError,
} from './errors';

export type {
  TokenSymbol,
  SolanaNetwork,
  TransferType,
  ShadowWireClientConfig,
  PoolBalance,
  DepositRequest,
  DepositResponse,
  WithdrawRequest,
  WithdrawResponse,
  UploadProofRequest,
  UploadProofResponse,
  ExternalTransferRequest,
  ExternalTransferResponse,
  InternalTransferRequest,
  InternalTransferResponse,
  TransferRequest,
  TransferResponse,
  ZKProofData,
  TransferWithClientProofsRequest,
  AuthorizeSpendingRequest,
  AuthorizeSpendingResponse,
  RevokeAuthorizationRequest,
  RevokeAuthorizationResponse,
  Authorization,
} from './types';

