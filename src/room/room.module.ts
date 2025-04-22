import { Module } from '@nestjs/common';
import { RoomGateway } from './room.gateway';
import { RoomController } from './room.controller';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { RoomService } from './room.service';
import { UserService } from 'src/user/user.service';

@Module({
  imports: [EventEmitterModule.forRoot()],
  providers: [RoomGateway, RoomService, UserService],
  controllers: [RoomController],
})
export class RoomModule {}