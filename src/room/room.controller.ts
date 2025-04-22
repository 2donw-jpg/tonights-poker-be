import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './interfaces/room.interface';
import { RoomService } from './room.service';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post()
  createRoom(@Body() dto: CreateRoomDto): Room {
    return this.roomService.createRoom(dto);
  }

  @Get()
  getRooms(): Room[] {
    return this.roomService.getRooms();
  }

  @Get(':id')
  getRoom(@Param('id') id: string): Room | undefined {
    return this.roomService.getRoom(id);
  }
}
