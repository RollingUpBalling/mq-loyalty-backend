import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Clients } from '../models/clients.model';
import { AuthGuard } from '../../../utils/guards/auth.guard';

@Controller('clients')
export class ClientsController {
  constructor() {}

  @Get('get-authorized')
  @UseGuards(AuthGuard)
  async getAuthorized(@Req() req) {
    console.log({ req: req.user });
  }

  @Get('get-unautorized')
  async getUnauthorized() {}
}
