import { expect } from "chai";
import { ethers } from "hardhat";

describe("Decode Custom Error Test", function () {
  it("Should decode custom error", async function () {
    // Define the custom error ABI
    const customErrorABI = [
      "error InvalidRandomnessReveal(bytes32 expected, bytes32 actual)",
    ];

    // Given error data (replace with the actual error data you have)
    const errorData =
      "0x08c379a00000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000001a507265636f6d6d69742064656c6179206e6f7420706173736564000000000000";

    // Function to decode custom error
    function decodeCustomError(data: string) {
      const iface = new ethers.Interface(customErrorABI);
      try {
        const decodedError = iface.parseError(data);
        return decodedError;
      } catch (err) {
        return "Unknown custom error";
      }
    }

    // Decode the output (revert reason)
    const decodedError = decodeCustomError(errorData);
    console.log(decodedError);
    // Check the decoded error
    // if (typeof decodedError === "string") {
    //   console.log("Revert reason:", decodedError);
    // } else {
    //   console.log("Revert reason:", decodedError.name);
    //   console.log("Expected:", decodedError.args.expected);
    //   console.log("Actual:", decodedError.args.actual);

    //   // Assertions to check if the decoded values are as expected
    //   expect(decodedError.name).to.equal("InvalidRandomnessReveal");
    //   expect(decodedError.args.expected).to.be.a("string");
    //   expect(decodedError.args.actual).to.be.a("string");
    // }
  });
});
