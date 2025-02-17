use solana_program::{
    account_info::AccountInfo,
    entrypoint,
    entrypoint::ProgramResult,
    msg,
    program_error::ProgramError,
    pubkey::Pubkey,
    sysvar::{rent::Rent, Sysvar},
    program_pack::Pack,
    program::invoke_signed,
};
use spl_token::state::Mint;

entrypoint!(process_instruction);

fn process_instruction(
    program_id: &Pubkey,
    accounts: &[AccountInfo],
    instruction_data: &[u8],
) -> ProgramResult {
    if instruction_data.len() != 8 {
        msg!("MintContract: Invalid instruction data length, expected 8 bytes");
        return Err(ProgramError::InvalidInstructionData);
    }

    let amount = u64::from_le_bytes(instruction_data.try_into().unwrap());

    // Account indexes
    let account_info_iter = &mut accounts.iter();
    let mint_account = next_account_info(account_info_iter)?;
    let destination_account = next_account_info(account_info_iter)?;
    let authority_account = next_account_info(account_info_iter)?;
    let rent_sysvar = next_account_info(account_info_iter)?;

    // Enhanced account validation
    if mint_account.owner != &spl_token::id() {
        msg!("MintContract: Mint account owner must be SPL Token program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if destination_account.owner != &spl_token::id() {
        msg!("MintContract: Destination account owner must be SPL Token program");
        return Err(ProgramError::IncorrectProgramId);
    }

    if !authority_account.is_signer {
        msg!("MintContract: Authority signature missing");
        return Err(ProgramError::IncorrectProgramId);
    }

    if !destination_account.owner.eq(&spl_token::id()) {
        msg!("Destination account is not owned by token program");
        return Err(ProgramError::IncorrectProgramId);
    }

    // Verify authority
    if !authority_account.is_signer {
        msg!("Authority did not sign");
        return Err(ProgramError::MissingRequiredSignature);
    }

    // Check rent exemption
    let rent = &Rent::from_account_info(rent_sysvar)?;
    if !rent.is_exempt(mint_account.lamports(), mint_account.data_len()) {
        msg!("Mint account is not rent exempt");
        return Err(ProgramError::AccountNotRentExempt);
    }

    // Load mint data
    let mut mint_data = Mint::unpack_unchecked(&mint_account.data.borrow())?;
    if mint_data.is_initialized && mint_data.mint_authority != COption::Some(*authority_account.key) {
        msg!("Invalid mint authority");
        return Err(ProgramError::InvalidAccountData);
    }

    // Execute minting
    invoke_signed(
        &spl_token::instruction::mint_to(
            &spl_token::id(),
            mint_account.key,
            destination_account.key,
            authority_account.key,
            &[],
            amount,
        )?,
        &[
            mint_account.clone(),
            destination_account.clone(),
            authority_account.clone(),
        ],
        &[&[b"mint", &[authority_account.key.to_bytes()[..31]], &[authority_account.key.to_bytes()[31]]]],
    )?;

    msg!("Successfully minted {} tokens", amount);
    Ok(())
}

