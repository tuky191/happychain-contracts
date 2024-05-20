import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import hre, { ethers } from "hardhat";
import * as crypto from "crypto";

function hashStringTo32Bytes(inputString: string): Buffer {
  // Create a SHA-256 hash object
  const hash = crypto.createHash("sha256");

  // Update the hash object with the input string
  hash.update(inputString);

  // Get the resulting hash as a Buffer
  const hashBuffer = hash.digest();

  return hashBuffer;
}

function bufferToHex(buffer: Buffer): string {
  return "0x" + buffer.toString("hex");
}

describe("SequencerRandomOracle", function () {
  async function deploySequencerRandomOracleFixture() {
    const [owner, otherAccount] = await hre.ethers.getSigners();

    const SequencerRandomOracle = await hre.ethers.getContractFactory(
      "SequencerRandomOracle"
    );
    const sequencerRandomOracle = await SequencerRandomOracle.deploy();

    return { sequencerRandomOracle, owner, otherAccount };
  }

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const address = await sequencerRandomOracle.getAddress();
      expect(address).to.properAddress;
    });
  });

  describe("Posting randomness commitment", function () {
    it("Should allow posting randomness commitment", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;
      const randomness = "randomness";
      const randomnessBytes32 = ethers.encodeBytes32String(randomness);
      const randomnessHash = ethers.solidityPackedKeccak256(
        ["bytes32"],
        [randomnessBytes32]
      );

      await expect(
        sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash)
      )
        .to.emit(sequencerRandomOracle, "SequencerRandomnessPosted")
        .withArgs(T, randomnessHash);

      const entry = await sequencerRandomOracle.sequencerEntries(T);
      expect(entry.randomnessHash).to.equal(randomnessHash);
      expect(entry.committed).to.be.true;
      expect(entry.revealed).to.be.false;
    });

    it("Should revert if randomness is already committed", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;
      const randomness = "randomness";
      const randomnessBytes32 = ethers.encodeBytes32String(randomness);
      const randomnessHash = ethers.solidityPackedKeccak256(
        ["bytes32"],
        [randomnessBytes32]
      );
      await sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash);

      await expect(
        sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash)
      ).to.be.revertedWithCustomError(
        sequencerRandomOracle,
        "SequencerEntryAlreadyCommitted"
      );
    });
  });

  describe("Revealing randomness", function () {
    it("Should reveal randomness after precommit delay", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;
      const randomness =
        "0xaff07feb058c3908335b80f307a0f0b6e45a45ff17437ea0e2ceec940ce9dd65";
      const hashedRandomness = hashStringTo32Bytes(randomness);
      const randomnessHash = ethers.solidityPackedKeccak256(
        ["bytes32"],
        [hashedRandomness]
      );
      await sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash);
      await hre.ethers.provider.send("evm_mine", []);
      for (let i = 0; i < 10; i++) {
        await hre.ethers.provider.send("evm_mine", []);
      }
      await expect(
        sequencerRandomOracle.revealSequencerRandomness(T, hashedRandomness)
      )
        .to.emit(sequencerRandomOracle, "SequencerRandomnessRevealed")
        .withArgs(T, hashedRandomness);
      const entry = await sequencerRandomOracle.sequencerEntries(T);
      expect(entry.randomness).to.equal(bufferToHex(hashedRandomness));
      expect(entry.revealed).to.be.true;
    });

    it("Should revert if precommit delay not passed", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;
      const randomness = "randomness";
      const randomnessBytes32 = ethers.encodeBytes32String(randomness);
      const randomnessHash = ethers.solidityPackedKeccak256(
        ["bytes32"],
        [randomnessBytes32]
      );
      await sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash);

      await expect(
        sequencerRandomOracle.revealSequencerRandomness(
          T,
          ethers.encodeBytes32String(randomness)
        )
      ).to.be.revertedWithCustomError(
        sequencerRandomOracle,
        "PrecommitDelayNotPassed"
      );
    });

    it("Should revert if invalid randomness is revealed", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;
      const invalidRandomness = "invalid";
      const randomness = "randomness";
      const randomnessBytes32 = ethers.encodeBytes32String(randomness);
      const randomnessHash = ethers.solidityPackedKeccak256(
        ["bytes32"],
        [randomnessBytes32]
      );
      await sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash);
      await hre.ethers.provider.send("evm_mine", []);
      for (let i = 0; i < 10; i++) {
        await hre.ethers.provider.send("evm_mine", []);
      }

      await expect(
        sequencerRandomOracle.revealSequencerRandomness(
          T,
          ethers.encodeBytes32String(invalidRandomness)
        )
      ).to.be.revertedWithCustomError(
        sequencerRandomOracle,
        "InvalidRandomnessReveal"
      );
    });
  });

  describe("Retrieving randomness", function () {
    it("Should retrieve revealed randomness", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;
      const randomness = "randomness";
      const randomnessBytes32 = ethers.encodeBytes32String(randomness);
      const randomnessHash = ethers.solidityPackedKeccak256(
        ["bytes32"],
        [randomnessBytes32]
      );
      const inBytes = ethers.encodeBytes32String("test");
      await sequencerRandomOracle.postRandomnessCommitment(T, randomnessHash);
      await hre.ethers.provider.send("evm_mine", []);
      for (let i = 0; i < 10; i++) {
        await hre.ethers.provider.send("evm_mine", []);
      }
      await sequencerRandomOracle.revealSequencerRandomness(
        T,
        ethers.encodeBytes32String(randomness)
      );

      const retrievedRandomness =
        await sequencerRandomOracle.getSequencerRandomness(T);
      expect(retrievedRandomness).to.equal(
        ethers.encodeBytes32String(randomness)
      );
    });

    it("Should revert if randomness is not revealed", async function () {
      const { sequencerRandomOracle } = await loadFixture(
        deploySequencerRandomOracleFixture
      );
      const T = 1;

      await expect(
        sequencerRandomOracle.getSequencerRandomness(T)
      ).to.be.revertedWith("Sequencer randomness not available");
    });
  });
});
