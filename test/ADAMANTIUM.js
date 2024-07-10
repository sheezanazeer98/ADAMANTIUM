const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("ADAMANTIUM Token", function () {
    let Token;
    let adamantium;
    let owner;
    let addr1;
    let addr2;
    let addrs;

    beforeEach(async function () {
        Token = await ethers.getContractFactory("ADAMANTIUM");
        [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        adamantium = await Token.deploy(addr1.address, addr2.address);
        await adamantium.deployed();
    });

    describe("Deployment", function () {
        it("Should assign the total supply of tokens to the owner", async function () {
            const ownerBalance = await adamantium.balanceOf(owner.address);
            expect(await adamantium.totalSupply()).to.equal(ownerBalance);
        });

        it("Should set the right owner", async function () {
            expect(await adamantium.owner()).to.equal(owner.address);
        });

        it("Should set fee addresses correctly", async function () {
            expect(await adamantium.feeAddress1()).to.equal(addr1.address);
            expect(await adamantium.feeAddress2()).to.equal(addr2.address);
        });
    });

    describe("Transactions", function () {
        it("Should transfer tokens between accounts", async function () {
            await adamantium.transfer(addr1.address, 100);
            const addr1Balance = await adamantium.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            await adamantium.connect(addr1).transfer(addr2.address, 50);
            const addr2Balance = await adamantium.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });

        it("Should fail if sender doesn’t have enough tokens", async function () {
            const initialOwnerBalance = await adamantium.balanceOf(owner.address);
            await expect(
                adamantium.connect(addr1).transfer(owner.address, 1)
            ).to.be.revertedWith("ADAMANTIUM: transfer amount exceeds balance");

            expect(await adamantium.balanceOf(owner.address)).to.equal(initialOwnerBalance);
        });

        it("Should update balances after transfers", async function () {
            const initialOwnerBalance = await adamantium.balanceOf(owner.address);

            await adamantium.transfer(addr1.address, 100);
            await adamantium.transfer(addr2.address, 50);

            const finalOwnerBalance = await adamantium.balanceOf(owner.address);
            expect(finalOwnerBalance).to.equal(initialOwnerBalance - 150);

            const addr1Balance = await adamantium.balanceOf(addr1.address);
            expect(addr1Balance).to.equal(100);

            const addr2Balance = await adamantium.balanceOf(addr2.address);
            expect(addr2Balance).to.equal(50);
        });
    });

    describe("Allowance", function () {
        it("Should approve and transferFrom correctly", async function () {
            await adamantium.approve(addr1.address, 100);
            expect(await adamantium.allowance(owner.address, addr1.address)).to.equal(100);

            await adamantium.connect(addr1).transferFrom(owner.address, addr2.address, 100);
            expect(await adamantium.balanceOf(addr2.address)).to.equal(100);
        });

        it("Should fail if transferFrom exceeds allowance", async function () {
            await adamantium.approve(addr1.address, 100);
            await expect(
                adamantium.connect(addr1).transferFrom(owner.address, addr2.address, 101)
            ).to.be.revertedWith("ADAMANTIUM: transfer amount exceeds allowance");
        });
    });

    describe("Owner functions", function () {
        it("Should allow the owner to change the max transaction amount", async function () {
            await adamantium.setMaxTxAmount(1000);
            expect(await adamantium.maxTxAmount()).to.equal(1000);
        });

        it("Should allow the owner to change the fee percentage", async function () {
            await adamantium.setFeePercent(10, 20);
            expect(await adamantium.taxFee1()).to.equal(10);
            expect(await adamantium.taxFee2()).to.equal(20);
        });
    });
});
