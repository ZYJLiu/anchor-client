use codama_sdk::accounts::Counter;
use codama_sdk::instructions::{IncrementBuilder, InitializeBuilder};
use solana_client::rpc_client::RpcClient;
use solana_sdk::{
    commitment_config::CommitmentConfig, native_token::LAMPORTS_PER_SOL, signature::Keypair,
    signer::Signer, system_program,
};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    let connection = RpcClient::new_with_commitment(
        "http://127.0.0.1:8899", // Local validator URL
        CommitmentConfig::confirmed(),
    );

    let payer = Keypair::new();
    let counter = Keypair::new();
    println!("Generated Keypairs:");
    println!("   Payer: {}", payer.pubkey());
    println!("   Counter: {}", counter.pubkey());

    println!("\nRequesting 1 SOL airdrop to payer");
    let airdrop_signature = connection.request_airdrop(&payer.pubkey(), LAMPORTS_PER_SOL)?;

    // Wait for airdrop confirmation
    while !connection.confirm_transaction(&airdrop_signature)? {
        std::thread::sleep(std::time::Duration::from_millis(100));
    }
    println!("   Airdrop confirmed!");

    println!("\nSend transaction with initialize and increment instructions");
    // Create initialize instruction
    let initialize_ix = InitializeBuilder::new()
        .payer(payer.pubkey())
        .counter(counter.pubkey())
        .system_program(system_program::ID)
        .instruction();

    // Create increment instruction
    let increment_ix = IncrementBuilder::new()
        .counter(counter.pubkey())
        .instruction();

    // Combine both instructions into a single transaction
    let recent_blockhash = connection.get_latest_blockhash()?;
    let transaction = solana_sdk::transaction::Transaction::new_signed_with_payer(
        &[initialize_ix, increment_ix], // Both instructions in the same transaction
        Some(&payer.pubkey()),
        &[&payer, &counter], // All required signers
        recent_blockhash,
    );

    let signature = connection.send_and_confirm_transaction(&transaction)?;
    println!("   Transaction confirmed: {}", signature);

    println!("\nFetch counter account data");
    if let Ok(account_data) = connection.get_account_data(&counter.pubkey()) {
        match Counter::from_bytes(&account_data) {
            Ok(counter_account) => {
                println!("   Counter value: {}", counter_account.count);
            }
            Err(err) => {
                println!("   Failed to deserialize counter data: {}", err);
            }
        }
    }
    Ok(())
}
