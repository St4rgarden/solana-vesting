#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod vesting {
    use super::*;

  pub fn close(_ctx: Context<CloseVesting>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.vesting.count = ctx.accounts.vesting.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.vesting.count = ctx.accounts.vesting.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeVesting>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.vesting.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeVesting<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Vesting::INIT_SPACE,
  payer = payer
  )]
  pub vesting: Account<'info, Vesting>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseVesting<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub vesting: Account<'info, Vesting>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub vesting: Account<'info, Vesting>,
}

#[account]
#[derive(InitSpace)]
pub struct Vesting {
  count: u8,
}
