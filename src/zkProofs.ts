import init, { generate_range_proof, verify_range_proof, ZKProofResult } from '../wasm/settler_wasm';
import { ZKProofData } from './types';
import { ProofGenerationError, WASMNotSupportedError } from './errors';
import * as path from 'path';
import * as fs from 'fs';

let wasmInitialized = false;

export async function initWASM(): Promise<void> {
  if (wasmInitialized) {
    return;
  }
  
  try {
    const wasmPaths = [
      path.join(__dirname, '../wasm/settler_wasm_bg.wasm'),
      path.join(process.cwd(), 'wasm/settler_wasm_bg.wasm'),
      path.join(process.cwd(), 'dist/wasm/settler_wasm_bg.wasm'),
    ];
    
    let wasmPath: string | undefined;
    for (const p of wasmPaths) {
      if (fs.existsSync(p)) {
        wasmPath = p;
        break;
      }
    }
    
    if (!wasmPath) {
      throw new Error('WASM file not found in any expected location');
    }
    
    const wasmBuffer = fs.readFileSync(wasmPath);
    await init(wasmBuffer);
    wasmInitialized = true;
  } catch (error: any) {
    throw new ProofGenerationError(`Could not load cryptography module: ${error.message}`);
  }
}

export async function generateRangeProof(
  amount: number,
  bitLength: number = 64
): Promise<ZKProofData> {
  if (!wasmInitialized) {
    await initWASM();
  }
  
  if (amount < 0) {
    throw new ProofGenerationError('Amount must be non-negative');
  }
  
  const maxAmount = Math.pow(2, bitLength);
  if (amount >= maxAmount) {
    throw new ProofGenerationError(`Amount exceeds ${bitLength}-bit range`);
  }
  
  if (!Number.isInteger(amount)) {
    throw new ProofGenerationError('Amount must be an integer');
  }
  
  try {
    const result: ZKProofResult = generate_range_proof(BigInt(amount), bitLength);
    
    return {
      proofBytes: uint8ArrayToHex(result.proof_bytes),
      commitmentBytes: uint8ArrayToHex(result.commitment_bytes),
      blindingFactorBytes: uint8ArrayToHex(result.blinding_factor_bytes),
    };
  } catch (error: any) {
    throw new ProofGenerationError(`Failed to generate proof: ${error.message || error}`);
  }
}

export async function verifyRangeProof(
  proofBytes: string,
  commitmentBytes: string,
  bitLength: number = 64
): Promise<boolean> {
  if (!wasmInitialized) {
    await initWASM();
  }
  
  try {
    const proofArray = hexToUint8Array(proofBytes);
    const commitmentArray = hexToUint8Array(commitmentBytes);
    
    return verify_range_proof(proofArray, commitmentArray, bitLength);
  } catch (error: any) {
    return false;
  }
}

export function isWASMSupported(): boolean {
  try {
    return typeof WebAssembly === 'object' && 
           typeof WebAssembly.instantiate === 'function';
  } catch (e) {
    return false;
  }
}

function uint8ArrayToHex(bytes: Uint8Array): string {
  return Array.from(bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join('');
}

function hexToUint8Array(hex: string): Uint8Array {
  if (hex.length % 2 !== 0) {
    throw new Error('Hex string must have even length');
  }
  
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16);
  }
  return bytes;
}

