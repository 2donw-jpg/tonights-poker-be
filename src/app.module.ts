import { Module } from '@nestjs/common';
import { SessionModule } from './session/session.module';
import { UserModule } from './user/user.module';
import { RoomModule } from './room/room.module';

@Module({
  imports: [SessionModule, UserModule, RoomModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
