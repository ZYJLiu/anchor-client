import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Example } from "../target/types/example";
import { Keypair } from "@solana/web3.js";

describe("example", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Example as Program<Example>;
  const counterAccount = new Keypair();

  it("Is initialized!", async () => {
    const transactionSignature = await program.methods
      .initialize()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .signers([counterAccount])
      .rpc({ skipPreflight: true });

    const accountData = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.count}`);
  });

  it("Increment", async () => {
    const transactionSignature = await program.methods
      .increment()
      .accounts({
        counter: counterAccount.publicKey,
      })
      .rpc();

    const accountData = await program.account.counter.fetch(
      counterAccount.publicKey
    );

    console.log(`Transaction Signature: ${transactionSignature}`);
    console.log(`Count: ${accountData.count}`);
  });
});
