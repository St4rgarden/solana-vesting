import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Vesting} from '../target/types/vesting'

describe('vesting', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Vesting as Program<Vesting>

  const vestingKeypair = Keypair.generate()

  it('Initialize Vesting', async () => {
    await program.methods
      .initialize()
      .accounts({
        vesting: vestingKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([vestingKeypair])
      .rpc()

    const currentCount = await program.account.vesting.fetch(vestingKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Vesting', async () => {
    await program.methods.increment().accounts({ vesting: vestingKeypair.publicKey }).rpc()

    const currentCount = await program.account.vesting.fetch(vestingKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Vesting Again', async () => {
    await program.methods.increment().accounts({ vesting: vestingKeypair.publicKey }).rpc()

    const currentCount = await program.account.vesting.fetch(vestingKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Vesting', async () => {
    await program.methods.decrement().accounts({ vesting: vestingKeypair.publicKey }).rpc()

    const currentCount = await program.account.vesting.fetch(vestingKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set vesting value', async () => {
    await program.methods.set(42).accounts({ vesting: vestingKeypair.publicKey }).rpc()

    const currentCount = await program.account.vesting.fetch(vestingKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the vesting account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        vesting: vestingKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.vesting.fetchNullable(vestingKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
