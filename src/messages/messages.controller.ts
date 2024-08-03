import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CreateMessageDto } from './dtos/create-message.dto';

@Controller('messages')
// o controller é um class decorator porque está sendo aplicado a uma classe
export class MessagesController {
  @Get()
  // decorator de método
  listMessages() {

  }

  @Post()
  createMessage(@Body() body: CreateMessageDto) {
    // body para extrair dados do corpo da requisição http
    console.log(body);
  }

  @Get('/:id')
  getMessage(@Param('id') id: string) {
    // param para extrair dado da URL
    console.log(id);
  }
}
