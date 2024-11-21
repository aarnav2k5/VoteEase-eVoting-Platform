const { expect } = require('chai')
const { ethers } = require('hardhat')

describe('DappVotes', () => {
    let contract, deployer, contestant1, contestant2, voter1, voter2, voter3

    const description = 'Lorem Ipsum'
    const title = "Republic Primary Election"
    const image = "https://image.png"
    const starts = Math.floor(Date.now() / 1000) + 60
    const ends = Math.floor(Date.now() / 1000) + 3660
    const pollsId = 1

    beforeEach(async () => {
        const Contract = await ethers.getContractFactory("DappVotes")
        ;[deployer, contestant1, contestant2, voter1, voter2, voter3] = await ethers.getSigners()

        contract = await Contract.deploy()
        await contract.deployed()
    })

    describe('Poll Management', () => {
        describe('Successes', () => {
            it('should confirm poll creation success', async () => {
                let result = await contract.getAllPolls()
                expect(result).to.have.lengthOf(0)

                await contract.createPoll(image, title, description, starts, ends)

                result = await contract.getAllPolls()
                expect(result).to.have.lengthOf(1)

                result = await contract.getPoll(pollsId)
                expect(result.title).to.be.equal(title)
                expect(result.director).to.be.equal(deployer.address)
            })

            it('should confirm poll update success', async () => {
                await contract.createPoll(image, title, description, starts, ends)

                result = await contract.getPoll(pollsId)
                expect(result.title).to.be.equal(title)

                await contract.updatePoll(pollsId, image, "New title", description, starts, ends)

                result = await contract.getPoll(pollsId)
                expect(result.title).to.be.equal("New title")
            })

            it('should confirm poll deletion success', async () => {
                await contract.createPoll(image, title, description, starts, ends)

                let result = await contract.getAllPolls()
                expect(result).to.have.lengthOf(1)

                result = await contract.getPoll(pollsId)
                expect(result.deleted).to.be.false

                await contract.deletePoll(pollsId)

                result = await contract.getAllPolls()
                expect(result).to.have.lengthOf(0)

                result = await contract.getPoll(pollsId)
                expect(result.deleted).to.be.true
            })
        }) 
    })
})