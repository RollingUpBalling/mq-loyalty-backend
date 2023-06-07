import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Clients } from '../../clients/models/clients.model';
import { ConfigService } from '@nestjs/config';
import { LoginTicket, OAuth2Client } from 'google-auth-library';
import { ErrorCode } from '../../../types/error_codes';
import { LoginResponseDto } from '../dto/login.response.dto';
import { JwtService } from '@nestjs/jwt';
import axios, { AxiosResponse } from 'axios';
import { BlockchainService } from '../../blockchain/services/blockchain.service';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('LOGIN SERVICE');

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly blockchainService: BlockchainService,
    @InjectModel(Clients) private clientsModel: typeof Clients,
  ) {}

  public async login(token: string): Promise<LoginResponseDto> {
    let ticket: AxiosResponse;
    try {
      ticket = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
        {
          headers: {
            Authorization: `Bearer ${token.toString()}`,
          },
        },
      );
    } catch (e) {
      this.logger.log({ message: 'Google auth failed' });
      return { success: false, errorCode: ErrorCode.GoogleAuthFailed };
    }

    const { email, name } = ticket.data;

    const client = await this.clientsModel.findOne({
      where: { email },
    });

    const foundClient = client ?? (await this.clientsModel.create({ email }));

    if (!client) {
      const result = await this.blockchainService.createSmartContractAddress(
        foundClient.id,
      );
      console.log({ result });
    }

    const accessToken: string = this.jwtService.sign({
      email,
      id: foundClient.id,
      token,
    });
    // 12 hours of access
    return {
      success: true,
      accessToken,
      accessTokenExpireAt: new Date(
        new Date().getTime() + 43200000,
      ).toUTCString(),
      client: foundClient,
    };
  }
}
