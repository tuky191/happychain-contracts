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
  ContractRunner,
  ContractMethod,
  Listener,
} from "ethers";
import type {
  TypedContractEvent,
  TypedDeferredTopicFilter,
  TypedEventLog,
  TypedListener,
  TypedContractMethod,
} from "./common";

export interface RandomnessOracleInterface extends Interface {
  getFunction(
    nameOrSignature:
      | "computeRandomness"
      | "drandOracle"
      | "isRandomnessEverAvailable"
      | "sequencerRandomOracle"
      | "simpleGetRandomness"
      | "unsafeGetRandomness"
  ): FunctionFragment;

  encodeFunctionData(
    functionFragment: "computeRandomness",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "drandOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "isRandomnessEverAvailable",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "sequencerRandomOracle",
    values?: undefined
  ): string;
  encodeFunctionData(
    functionFragment: "simpleGetRandomness",
    values: [BigNumberish]
  ): string;
  encodeFunctionData(
    functionFragment: "unsafeGetRandomness",
    values: [BigNumberish]
  ): string;

  decodeFunctionResult(
    functionFragment: "computeRandomness",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "drandOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "isRandomnessEverAvailable",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "sequencerRandomOracle",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "simpleGetRandomness",
    data: BytesLike
  ): Result;
  decodeFunctionResult(
    functionFragment: "unsafeGetRandomness",
    data: BytesLike
  ): Result;
}

export interface RandomnessOracle extends BaseContract {
  connect(runner?: ContractRunner | null): RandomnessOracle;
  waitForDeployment(): Promise<this>;

  interface: RandomnessOracleInterface;

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

  computeRandomness: TypedContractMethod<[T: BigNumberish], [string], "view">;

  drandOracle: TypedContractMethod<[], [string], "view">;

  isRandomnessEverAvailable: TypedContractMethod<
    [T: BigNumberish],
    [boolean],
    "view"
  >;

  sequencerRandomOracle: TypedContractMethod<[], [string], "view">;

  simpleGetRandomness: TypedContractMethod<[T: BigNumberish], [string], "view">;

  unsafeGetRandomness: TypedContractMethod<[T: BigNumberish], [string], "view">;

  getFunction<T extends ContractMethod = ContractMethod>(
    key: string | FunctionFragment
  ): T;

  getFunction(
    nameOrSignature: "computeRandomness"
  ): TypedContractMethod<[T: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "drandOracle"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "isRandomnessEverAvailable"
  ): TypedContractMethod<[T: BigNumberish], [boolean], "view">;
  getFunction(
    nameOrSignature: "sequencerRandomOracle"
  ): TypedContractMethod<[], [string], "view">;
  getFunction(
    nameOrSignature: "simpleGetRandomness"
  ): TypedContractMethod<[T: BigNumberish], [string], "view">;
  getFunction(
    nameOrSignature: "unsafeGetRandomness"
  ): TypedContractMethod<[T: BigNumberish], [string], "view">;

  filters: {};
}
