import { clusterApiUrl, Connection, PublicKey, Keypair } from "@solana/web3.js";
import { IdlAccounts, Program } from "@coral-xyz/anchor";
import type { Example } from "./target/types/example.ts";
import idl from "./target/idl/example.json";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");

const program = new Program(idl as Example, {
  connection,
});

const payer = Keypair.generate();
const counter = Keypair.generate();

const airdrop = await connection.requestAirdrop(payer.publicKey, 1000000000);
