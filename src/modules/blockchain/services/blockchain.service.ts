import { forwardRef, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  connect,
  Contract,
  KeyPair,
  keyStores,
  Near,
  utils,
} from 'near-api-js';
import * as BN from 'bn.js';
import * as fs from 'fs';
import { round } from 'lodash';
import { InjectModel } from '@nestjs/sequelize';
import { BlockchainAddresses } from '../models/blockchain_addresses.model';
import { AddressType } from '../types/address_type.enum';
import { NotFoundError } from 'rxjs';
import { ProjectUsersService } from '../../project_users/services/project_users.service';
import { Nft } from '../../nfts/models/nfts.model';
import { NftsService } from '../../nfts/services/nfts.service';

const HELLO_WASM_BALANCE = new BN('10000000000000000000000000');
const HELLO_WASM_PATH = './rust-smart-contract/out/main.wasm';

const { parseNearAmount } = utils.format;

@Injectable()
export class BlockchainService {
  private readonly logger: Logger = new Logger('Blockchain SERVICE');

  constructor(
    private readonly configService: ConfigService,
    private readonly userService: ProjectUsersService,
    @InjectModel(BlockchainAddresses)
    private blockchainAddressesModel: typeof BlockchainAddresses,
    @Inject(forwardRef(() => NftsService))
    private readonly nftService: NftsService,
  ) {}

  public async createAddress(clientId: string, userId: string): Promise<any> {
    const newAccountAddress =
      'mq_loyalty_user' + round(Math.random() * 10000000) + '.testnet';

    const user = await this.userService.getOne(clientId, userId);
    if (!user) {
      throw new NotFoundError('no user found');
    }

    const userAddress = await this.blockchainAddressesModel.findOne({
      where: { userId, clientId },
    });

    if (userAddress) {
      return { success: true, address: userAddress.address };
    }

    const { privateKey } = await this.createAccountAndReturnKeys(
      newAccountAddress,
      AddressType.UserAddress,
    );
    await this.blockchainAddressesModel.create({
      address: newAccountAddress,
      privateKey,
      clientId,
      userId,
      addressType: AddressType.UserAddress,
    });

    return { success: true, address: newAccountAddress };
  }

  private async createAccountAndReturnKeys(
    address: string,
    addressType: AddressType,
    config?: { near: Near; configNear: any },
  ): Promise<{ address: string; privateKey: string }> {
    let near, configNear;

    if (!config) {
      configNear = await this.getNearConfig({});
      near = await connect(configNear);
    } else {
      near = config.near;
      configNear = config.configNear;
    }

    const rootAccount = await near.account(configNear.accountId);

    const keyPair = KeyPair.fromRandom('ed25519');
    const publicKey = keyPair.getPublicKey().toString();
    await configNear.keyStore.setKey(configNear.networkId, address, keyPair);
    const result = await rootAccount.functionCall({
      contractId: configNear.networkId,
      methodName: 'create_account',
      args: {
        new_account_id: address,
        new_public_key: publicKey,
      },
      gas: '300000000000000',
      attachedDeposit:
        addressType === AddressType.SmartContract
          ? utils.format.parseNearAmount('12')
          : utils.format.parseNearAmount('1.1'),
    });
    console.log({ result });
    const keysToSave = await configNear.keyStore.getKey(
      configNear.networkId,
      address,
    );

    return { address, privateKey: keysToSave.secretKey };
  }

  public async createSmartContractAddress(clientId: string): Promise<any> {
    const configNear = await this.getNearConfig({});
    const near = await connect(configNear);

    const newAccountAddress =
      'mq_loyalty_project' + round(Math.random() * 100000) + '.testnet';

    const { privateKey } = await this.createAccountAndReturnKeys(
      newAccountAddress,
      AddressType.SmartContract,
      { near, configNear },
    );
    console.log({ privateKey });

    await this.blockchainAddressesModel.create({
      address: newAccountAddress,
      privateKey,
      clientId,
      addressType: AddressType.SmartContract,
    });

    const newAccount = await near.account(newAccountAddress);
    const elements = fs.readFileSync(HELLO_WASM_PATH);
    const data = new Uint8Array([...elements]);

    await newAccount.deployContract(data);

    const contract = new Contract(newAccount, newAccount.accountId, {
      viewMethods: [''],
      changeMethods: [
        'new_default_meta',
        'init',
        'metadata_create',
        'team_list_add',
        'og_list_add',
        'white_list_add',
      ],
    });

    // @ts-ignore
    const item = await contract.new_default_meta({
      owner_id: newAccount.accountId,
    });

    console.log({ item });

    return 'success';
  }

  private async getNearConfig({
    privateKey,
    accountId,
  }: {
    privateKey?: string;
    accountId?: string;
  }) {
    const networkId: string = this.configService.get('near.net');
    if (!privateKey || !accountId) {
      privateKey = this.configService.get(`near.privateKey`);
      accountId = this.configService.get(`near.accountId`);
    }
    const keyStore = new keyStores.InMemoryKeyStore();

    const keyPair = KeyPair.fromString(privateKey);

    await keyStore.setKey(networkId, accountId, keyPair);

    const configNear: any = {
      networkId,
      keyStore,
      accountId,
      nodeUrl: `https://rpc.${networkId}.near.org`,
      walletUrl: `https://wallet.${networkId}.near.org`,
      helperUrl: `https://helper.${networkId}.near.org`,
      explorerUrl: `https://explorer.${networkId}.near.org`,
    };

    return configNear;
  }

  public async getContractAddress(clientId: string) {
    const smartContractKeys = await this.blockchainAddressesModel.findOne({
      where: { clientId, addressType: AddressType.SmartContract },
    });

    return smartContractKeys.address;
  }
  private async getContract(clientId: string, addressType: AddressType) {
    const smartContractKeys = await this.blockchainAddressesModel.findOne({
      where: { clientId, addressType },
    });

    if (!smartContractKeys) {
      throw new NotFoundError('smart contract keys has not been found');
    }

    const config = await this.getNearConfig({
      privateKey: smartContractKeys.privateKey,
      accountId: smartContractKeys.address,
    });

    const near = await connect(config);

    const account = await near.account(config.accountId);

    const contract = new Contract(account, config.accountId, {
      viewMethods: ['nft_token'],
      changeMethods: [
        'new_default_meta',
        'init',
        'nft_mint',
        'nft_mint_by_id',
        'public_sales',
        'metadata_create',
        'team_list_add',
        'og_list_add',
        'white_list_add',
      ],
    });
    return contract;
  }
  public async addMetadata(
    clientId: string,
    tokenId: string,
    nftMetadata: { title: string; description: string; media: string },
  ) {
    const contract = await this.getContract(
      clientId,
      AddressType.SmartContract,
    );
    // @ts-ignore
    const itesm = await contract.metadata_create({
      title: nftMetadata.title,
      description: nftMetadata.description,
      token_id: tokenId.toString(),
      media: nftMetadata.media,
      extra: JSON.stringify({
        attributes: {},
      }),
    });
    console.log({ itesm });
    return 'success';
  }

  public async openSales(clientId: string) {
    const contract = await this.getContract(
      clientId,
      AddressType.SmartContract,
    );

    // @ts-ignore
    const itesm = await contract.public_sales({ status: true });
    console.log({ itesm });
    return itesm;
  }

  public async checkNftProperties(clientId: string, tokenId: string) {
    const contract = await this.getContract(
      clientId,
      AddressType.SmartContract,
    );

    // @ts-ignore
    const itesm = await contract.nft_token({ token_id: tokenId });
    console.log({ itesm });
    return itesm;
  }

  public async mintNft(
    clientId: string,
    userId: string,
    address: string,
    nftId: string,
  ) {
    const nft = await this.nftService.getOne(clientId, nftId);
    if (!nft) {
      return { success: false };
    }

    const contract = await this.getContract(
      clientId,
      AddressType.SmartContract,
    );

    // @ts-ignore
    const itesm = await contract.nft_mint_by_id(
      { receiver_id: 'crash2.testnet', token_id: Number(nft.tokenId) },
      300000000000000, // attached GAS
      // utils.format.parseNearAmount('1'),
    );
    await nft.update({ minted: true, projectUserId: userId });
    console.log({ itesm });
    return itesm;
  }

  public async mintNftInSales(clientId: string, address: string) {
    const contract = await this.getContract(
      clientId,
      AddressType.SmartContract,
    );

    // @ts-ignore
    const itesm = await contract.nft_mint(
      { receiver_id: address },
      300000000000000, // attached GAS
      utils.format.parseNearAmount('1'),
    );
    console.log({ itesm });
    return itesm;
  }
}
