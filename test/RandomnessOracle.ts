import {
  loadFixture,
  time,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";

describe("RandomnessOracle", function () {
  async function deployRandomnessOracleFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();
    const TIMEOUT = 10; // seconds

    // Deploy DrandOracle
    const DrandOracle = await hre.ethers.getContractFactory("DrandOracle");
    const drandOracle = await DrandOracle.deploy();

    // Deploy SequencerRandomOracle
    const SequencerRandomOracle = await hre.ethers.getContractFactory(
      "SequencerRandomOracle"
    );
    const sequencerRandomOracle = await SequencerRandomOracle.deploy();

    // Deploy RandomnessOracle
    const RandomnessOracle = await hre.ethers.getContractFactory(
      "RandomnessOracle"
    );
    const randomnessOracle = await RandomnessOracle.deploy(
      drandOracle.getAddress(),
      sequencerRandomOracle.getAddress()
    );

    return {
      randomnessOracle,
      drandOracle,
      sequencerRandomOracle,
      owner,
      otherAccount,
      TIMEOUT,
    };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { randomnessOracle } = await loadFixture(
        deployRandomnessOracleFixture
      );
      const address = await randomnessOracle.getAddress();
      expect(address).to.properAddress;
    });
  });

  describe("Computing randomness", function () {
    it("Should return correct computed randomness", async function () {
      const { randomnessOracle, drandOracle, sequencerRandomOracle, TIMEOUT } =
        await loadFixture(deployRandomnessOracleFixture);

      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");
      const sequencerRandomness = ethers.encodeBytes32String(
        "sequencerRandomness"
      );
      await drandOracle.postDrandRandomness(T, drandRandomness);
      await sequencerRandomOracle.postRandomnessCommitment(
        T,
        ethers.solidityPackedKeccak256(["bytes32"], [sequencerRandomness])
      );
      for (let i = 0; i < 10; i++) {
        await hre.ethers.provider.send("evm_mine", []);
      }
      await sequencerRandomOracle.revealSequencerRandomness(
        T,
        sequencerRandomness
      );

      const expectedRandomness = ethers.solidityPackedKeccak256(
        ["bytes32", "bytes32"],
        [drandRandomness, sequencerRandomness]
      );

      const computedRandomness = await randomnessOracle.computeRandomness(T);
      expect(computedRandomness).to.equal(expectedRandomness);
    });

    it("Should return 0 if any randomness is not available", async function () {
      const { randomnessOracle, drandOracle, TIMEOUT } = await loadFixture(
        deployRandomnessOracleFixture
      );
      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");

      await drandOracle.postDrandRandomness(T, drandRandomness);

      const computedRandomness = await randomnessOracle.computeRandomness(T);
      expect(computedRandomness).to.equal(ethers.ZeroHash);
    });
  });

  describe("Checking if randomness is ever available", function () {
    it("Should return true if randomness is available", async function () {
      const { randomnessOracle, drandOracle, sequencerRandomOracle, TIMEOUT } =
        await loadFixture(deployRandomnessOracleFixture);
      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");
      const sequencerRandomness = ethers.encodeBytes32String(
        "sequencerRandomness"
      );

      await drandOracle.postDrandRandomness(T, drandRandomness);
      await sequencerRandomOracle.postRandomnessCommitment(
        T,
        ethers.solidityPackedKeccak256(["bytes32"], [sequencerRandomness])
      );
      for (let i = 0; i < 10; i++) {
        await hre.ethers.provider.send("evm_mine", []);
      }
      await sequencerRandomOracle.revealSequencerRandomness(
        T,
        sequencerRandomness
      );

      const isAvailable = await randomnessOracle.isRandomnessEverAvailable(T);
      expect(isAvailable).to.be.true;
    });

    it("Should return false if randomness is not available", async function () {
      const { randomnessOracle, drandOracle, TIMEOUT } = await loadFixture(
        deployRandomnessOracleFixture
      );
      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");

      await drandOracle.postDrandRandomness(T, drandRandomness);

      const isAvailable = await randomnessOracle.isRandomnessEverAvailable(T);
      expect(isAvailable).to.be.false;
    });
  });

  describe("Getting randomness", function () {
    it("Should retrieve randomness if available", async function () {
      const { randomnessOracle, drandOracle, sequencerRandomOracle, TIMEOUT } =
        await loadFixture(deployRandomnessOracleFixture);
      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");
      const sequencerRandomness = ethers.encodeBytes32String(
        "sequencerRandomness"
      );

      await drandOracle.postDrandRandomness(T, drandRandomness);
      await sequencerRandomOracle.postRandomnessCommitment(
        T,
        ethers.solidityPackedKeccak256(["bytes32"], [sequencerRandomness])
      );
      for (let i = 0; i < 10; i++) {
        await hre.ethers.provider.send("evm_mine", []);
      }
      await sequencerRandomOracle.revealSequencerRandomness(
        T,
        sequencerRandomness
      );

      const expectedRandomness = ethers.solidityPackedKeccak256(
        ["bytes32", "bytes32"],
        [drandRandomness, sequencerRandomness]
      );

      const retrievedRandomness = await randomnessOracle.simpleGetRandomness(T);
      expect(retrievedRandomness).to.equal(expectedRandomness);
    });

    it("Should revert if randomness is not available", async function () {
      const { randomnessOracle, drandOracle, TIMEOUT } = await loadFixture(
        deployRandomnessOracleFixture
      );
      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");

      await drandOracle.postDrandRandomness(T, drandRandomness);

      await expect(randomnessOracle.simpleGetRandomness(T)).to.be.revertedWith(
        "Randomness is not available"
      );
    });

    it("Should unsafely retrieve randomness even if not available", async function () {
      const { randomnessOracle, drandOracle, TIMEOUT } = await loadFixture(
        deployRandomnessOracleFixture
      );
      const T = (await time.latest()) + TIMEOUT - 1;
      const drandRandomness = ethers.encodeBytes32String("drandRandomness");

      await drandOracle.postDrandRandomness(T, drandRandomness);

      const retrievedRandomness = await randomnessOracle.unsafeGetRandomness(T);
      expect(retrievedRandomness).to.equal(ethers.ZeroHash);
    });
  });
});
