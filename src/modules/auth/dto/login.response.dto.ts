import { Clients } from '../../clients/models/clients.model';
import { ErrorCode } from '../../../types/error_codes';

export type LoginResponseDto =
  | { success: true; accessToken: string; accessTokenExpireAt: string; client: Clients }
  | { success: false; errorCode: ErrorCode };
