import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("DrandOracle", function () {
  async function deployDrandOracleFixture() {
    const TIMEOUT = 10; // seconds

    // Contracts are deployed using the first signer/account by default
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const DrandOracle = await hre.ethers.getContractFactory("DrandOracle");
    const drandOracle = await DrandOracle.deploy();

    return { drandOracle, owner, otherAccount, TIMEOUT };
  }

  describe("postDrandRandomness", function () {
    it("should post drand randomness within the timeout period", async function () {
      const { drandOracle, TIMEOUT } = await loadFixture(
        deployDrandOracleFixture
      );
      const T = (await time.latest()) + TIMEOUT - 1;
      const randomness = ethers.encodeBytes32String("randomness");
      await drandOracle.postDrandRandomness(T, randomness);
      const storedRandomness = await drandOracle.getDrand(T);
      expect(storedRandomness).to.equal(randomness);
    });

    it("should not allow posting randomness after the update period has expired", async function () {
      const { drandOracle, TIMEOUT } = await loadFixture(
        deployDrandOracleFixture
      );
      const T = await time.latest();
      const randomness = ethers.encodeBytes32String("randomness");

      // Simulate time passing beyond the TIMEOUT period
      await time.increase(TIMEOUT + 1);

      await expect(
        drandOracle.postDrandRandomness(T, randomness)
      ).to.be.revertedWith("Update period has expired");
    });

    it("should not allow posting randomness if the entry is already filled", async function () {
      const { drandOracle, TIMEOUT } = await loadFixture(
        deployDrandOracleFixture
      );
      const T = await time.latest();
      const randomness = ethers.encodeBytes32String("randomness");

      await drandOracle.postDrandRandomness(T, randomness);
      await expect(
        drandOracle.postDrandRandomness(T, randomness)
      ).to.be.revertedWith("Drand entry already filled");
    });
  });

  describe("getDrand", function () {
    it("should return the correct randomness if drand randomness is available", async function () {
      const { drandOracle } = await loadFixture(deployDrandOracleFixture);
      const T = await time.latest();
      const randomness = ethers.encodeBytes32String("randomness");

      await drandOracle.postDrandRandomness(T, randomness);
      const storedRandomness = await drandOracle.getDrand(T);
      expect(storedRandomness).to.equal(randomness);
    });

    it("should revert if drand randomness is not available", async function () {
      const { drandOracle } = await loadFixture(deployDrandOracleFixture);
      const T = await time.latest();

      await expect(drandOracle.getDrand(T)).to.be.revertedWith(
        "Drand entry not available"
      );
    });
  });

  describe("isDrandAvailable", function () {
    it("should return true if drand randomness is available", async function () {
      const { drandOracle } = await loadFixture(deployDrandOracleFixture);
      const T = await time.latest();
      const randomness = ethers.encodeBytes32String("randomness");

      await drandOracle.postDrandRandomness(T, randomness);
      const isAvailable = await drandOracle.isDrandAvailable(T);
      expect(isAvailable).to.be.true;
    });

    it("should return false if drand randomness is not available", async function () {
      const { drandOracle } = await loadFixture(deployDrandOracleFixture);
      const T = await time.latest();

      const isAvailable = await drandOracle.isDrandAvailable(T);
      expect(isAvailable).to.be.false;
    });
  });

  describe("hasUpdatePeriodExpired", function () {
    it("should return true if update period has expired", async function () {
      const { drandOracle, TIMEOUT } = await loadFixture(
        deployDrandOracleFixture
      );
      const T = await time.latest();

      // Simulate time passing beyond the TIMEOUT period
      await time.increase(TIMEOUT + 1);

      const hasExpired = await drandOracle.hasUpdatePeriodExpired(T);
      expect(hasExpired).to.be.true;
    });

    it("should return false if update period has not expired", async function () {
      const { drandOracle, TIMEOUT } = await loadFixture(
        deployDrandOracleFixture
      );
      const T = await time.latest();

      const hasExpired = await drandOracle.hasUpdatePeriodExpired(T);
      expect(hasExpired).to.be.false;
    });
  });
});
