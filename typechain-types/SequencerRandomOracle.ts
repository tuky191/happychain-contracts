/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import type {
  BaseContract,
  BigNumberish,
  BytesLike,
  FunctionFragment,
  Result,
  Interface,
  EventFragment,
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedLogDescription,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface SequencerRandomOracleInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "getSequencerRandomness"
      | "postRandomnessCommitment"
      | "revealSequencerRandomness"
      | "sequencerEntries"
  ): FunctionFragment;

  getEvent(
    nameOrSignatureOrTopic:
      | "SequencerRandomnessPosted"
      | "SequencerRandomnessRevealed"
  ): EventFragment;

  encodeFunctionData(
    functionFragment: "getSequencerRandomness",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "postRandomnessCommitment",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "revealSequencerRandomness",
    values: [BigNumberish, BytesLike]
  ): string;
  encodeFunctionData(
    functionFragment: "sequencerEntries",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "getSequencerRandomness",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "postRandomnessCommitment",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "revealSequencerRandomness",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sequencerEntries",
    data: BytesLike
  ): Result;
}

export namespace SequencerRandomnessPostedEvent {
  export type InputTuple = [T: BigNumberish, randomnessHash: BytesLike];
  export type OutputTuple = [T: bigint, randomnessHash: string];
  export interface OutputObject {
    T: bigint;
    randomnessHash: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export namespace SequencerRandomnessRevealedEvent {
  export type InputTuple = [T: BigNumberish, randomness: BytesLike];
  export type OutputTuple = [T: bigint, randomness: string];
  export interface OutputObject {
    T: bigint;
    randomness: string;
  }
  export type Event = TypedContractEvent<InputTuple, OutputTuple, OutputObject>;
  export type Filter = TypedDeferredTopicFilter<Event>;
  export type Log = TypedEventLog<Event>;
  export type LogDescription = TypedLogDescription<Event>;
}

export interface SequencerRandomOracle extends BaseContract {
  connect(runner?: ContractRunner | null): SequencerRandomOracle;
  waitForDeployment(): Promise<this>;

  interface: SequencerRandomOracleInterface;

  queryFilter<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;
  queryFilter<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    fromBlockOrBlockhash?: string | number | undefined,
    toBlock?: string | number | undefined
  ): Promise<Array<TypedEventLog<TCEvent>>>;

  on<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  on<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  once<TCEvent extends TypedContractEvent>(
    event: TCEvent,
    listener: TypedListener<TCEvent>
  ): Promise<this>;
  once<TCEvent extends TypedContractEvent>(
    filter: TypedDeferredTopicFilter<TCEvent>,
    listener: TypedListener<TCEvent>
  ): Promise<this>;

  listeners<TCEvent extends TypedContractEvent>(
    event: TCEvent
  ): Promise<Array<TypedListener<TCEvent>>>;
  listeners(eventName?: string): Promise<Array<Listener>>;
  removeAllListeners<TCEvent extends TypedContractEvent>(
    event?: TCEvent
  ): Promise<this>;

  getSequencerRandomness: TypedContractMethod<
    [T: BigNumberish],
    [string],
    "view"
  >;

  postRandomnessCommitment: TypedContractMethod<
    [T: BigNumberish, randomnessHash: BytesLike],
    [void],
    "nonpayable"
  >;

  revealSequencerRandomness: TypedContractMethod<
    [T: BigNumberish, randomness: BytesLike],
    [void],
    "nonpayable"
  >;

  sequencerEntries: TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, boolean, boolean] & {
        randomnessHash: string;
        randomness: string;
        blockNumber: bigint;
        committed: boolean;
        revealed: boolean;
      }
    ],
    "view"
  >;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "getSequencerRandomness"
  ): TypedContractMethod<[T: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "postRandomnessCommitment"
  ): TypedContractMethod<
    [T: BigNumberish, randomnessHash: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "revealSequencerRandomness"
  ): TypedContractMethod<
    [T: BigNumberish, randomness: BytesLike],
    [void],
    "nonpayable"
  >;
  getFunction(
    nameOrSignature: "sequencerEntries"
  ): TypedContractMethod<
    [arg0: BigNumberish],
    [
      [string, string, bigint, boolean, boolean] & {
        randomnessHash: string;
        randomness: string;
        blockNumber: bigint;
        committed: boolean;
        revealed: boolean;
      }
    ],
    "view"
  >;

  getEvent(
    key: "SequencerRandomnessPosted"
  ): TypedContractEvent<
    SequencerRandomnessPostedEvent.InputTuple,
    SequencerRandomnessPostedEvent.OutputTuple,
    SequencerRandomnessPostedEvent.OutputObject
  >;
  getEvent(
    key: "SequencerRandomnessRevealed"
  ): TypedContractEvent<
    SequencerRandomnessRevealedEvent.InputTuple,
    SequencerRandomnessRevealedEvent.OutputTuple,
    SequencerRandomnessRevealedEvent.OutputObject
  >;

  filters: {
    "SequencerRandomnessPosted(uint256,bytes32)": TypedContractEvent<
      SequencerRandomnessPostedEvent.InputTuple,
      SequencerRandomnessPostedEvent.OutputTuple,
      SequencerRandomnessPostedEvent.OutputObject
    >;
    SequencerRandomnessPosted: TypedContractEvent<
      SequencerRandomnessPostedEvent.InputTuple,
      SequencerRandomnessPostedEvent.OutputTuple,
      SequencerRandomnessPostedEvent.OutputObject
    >;

    "SequencerRandomnessRevealed(uint256,bytes32)": TypedContractEvent<
      SequencerRandomnessRevealedEvent.InputTuple,
      SequencerRandomnessRevealedEvent.OutputTuple,
      SequencerRandomnessRevealedEvent.OutputObject
    >;
    SequencerRandomnessRevealed: TypedContractEvent<
      SequencerRandomnessRevealedEvent.InputTuple,
      SequencerRandomnessRevealedEvent.OutputTuple,
      SequencerRandomnessRevealedEvent.OutputObject
    >;
  };
}