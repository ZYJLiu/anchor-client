/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  containsBytes,
  fixEncoderSize,
  getBytesEncoder,
  type Address,
  type ReadonlyUint8Array,
} from '@solana/web3.js';
import {
  type ParsedIncrementInstruction,
  type ParsedInitializeInstruction,
} from '../instructions';

export const EXAMPLE_PROGRAM_ADDRESS =
  '6khKp4BeJpCjBY1Eh39ybiqbfRnrn2UzWeUARjQLXYRC' as Address<'6khKp4BeJpCjBY1Eh39ybiqbfRnrn2UzWeUARjQLXYRC'>;

export enum ExampleAccount {
  Counter,
}

export function identifyExampleAccount(
  account: { data: ReadonlyUint8Array } | ReadonlyUint8Array
): ExampleAccount {
  const data = 'data' in account ? account.data : account;
  if (
    containsBytes(
      data,
      fixEncoderSize(getBytesEncoder(), 8).encode(
        new Uint8Array([255, 176, 4, 245, 188, 253, 124, 25])
      ),
      0
    )
  ) {
    return ExampleAccount.Counter;
  }
  throw new Error(
    'The provided account could not be identified as a example account.'
  );
}

export enum ExampleInstruction {
  Increment,
  Initialize,
}

export function identifyExampleInstruction(
  instruction: { data: ReadonlyUint8Array } | ReadonlyUint8Array
): ExampleInstruction {
  const data = 'data' in instruction ? instruction.data : instruction;
  if (
    containsBytes(
      data,
      fixEncoderSize(getBytesEncoder(), 8).encode(
        new Uint8Array([11, 18, 104, 9, 104, 174, 59, 33])
      ),
      0
    )
  ) {
    return ExampleInstruction.Increment;
  }
  if (
    containsBytes(
      data,
      fixEncoderSize(getBytesEncoder(), 8).encode(
        new Uint8Array([175, 175, 109, 31, 13, 152, 155, 237])
      ),
      0
    )
  ) {
    return ExampleInstruction.Initialize;
  }
  throw new Error(
    'The provided instruction could not be identified as a example instruction.'
  );
}

export type ParsedExampleInstruction<
  TProgram extends string = '6khKp4BeJpCjBY1Eh39ybiqbfRnrn2UzWeUARjQLXYRC',
> =
  | ({
      instructionType: ExampleInstruction.Increment;
    } & ParsedIncrementInstruction<TProgram>)
  | ({
      instructionType: ExampleInstruction.Initialize;
    } & ParsedInitializeInstruction<TProgram>);
