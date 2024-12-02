import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { Program } from "@coral-xyz/anchor";
import type { Example } from "./idl/example.ts";
import idl from "./idl/example.json";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

const program = new Program(idl as Example, {
  connection,
});

const payer = Keypair.generate();
const counter = Keypair.generate();

const airdropTransactionSignature = await connection.requestAirdrop(
  payer.publicKey,
  LAMPORTS_PER_SOL
);
await connection.confirmTransaction(airdropTransactionSignature);

const initializeInstruction = await program.methods
  .initialize()
  .accounts({
    payer: payer.publicKey,
    counter: counter.publicKey,
  })
  .instruction();

const incrementInstruction = await program.methods
  .increment()
  .accounts({
    counter: counter.publicKey,
  })
  .instruction();

const transaction = new Transaction().add(
  initializeInstruction,
  incrementInstruction
);

const transactionSignature = await sendAndConfirmTransaction(
  connection,
  transaction,
  [payer, counter]
);
console.log("Transaction Signature", transactionSignature);

const counterAccount = await program.account.counter.fetch(counter.publicKey);
console.log("Count:", counterAccount.count);
