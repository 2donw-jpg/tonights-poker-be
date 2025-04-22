import { Controller, Post, Body, Get, Param, NotFoundException } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { Room } from './interfaces/room.interface';
import { RoomService } from './room.service';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('rooms')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Post('create')
  createRoom(@Body() dto: CreateRoomDto): Room {
    return this.roomService.createRoom(dto);
  }

  @Post(':id/join')
  joinRoom(@Param('id') roomId: string, @Body() body: { userId: string }) {
    const room = this.roomService.joinRoom(roomId, body.userId);
    if (!room) {
      throw new NotFoundException('Room or user not found');
    }
  
    // Optional: Return room state if needed
    return { success: true };
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
