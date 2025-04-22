import { Injectable } from '@nestjs/common';
import { Room } from './interfaces/room.interface';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserSession } from '../user/interfaces/user.interface';
import { CreateRoomDto } from './dto/create-room.dto';
import { v4 as uuidv4 } from 'uuid';


@Injectable()
export class RoomService {


    constructor(private eventEmitter: EventEmitter2) { }


    private rooms: Map<string, Room> = new Map();

    createRoom(dto: CreateRoomDto): Room {
        const room: Room = {
            id: uuidv4(),
            name: dto.name || 'Untitled Room',
            createdAt: Date.now(),
            users: [],
            topics: [],
            votesValues: [0, 1, 2, 3, 5, 8, 13, 21],
            votes: {},
            isRevealed: false,
        };
        this.rooms.set(room.id, room);
        this.eventEmitter.emit('room.created', room);
        return room;
    }

    getRoom(id: string): Room | undefined {
        return this.rooms.get(id);
    }

    joinRoom(roomId: string, user: UserSession): Room | null {
        const room = this.rooms.get(roomId);
        if (!room) return null;

        const alreadyInRoom = room.users.find((u) => u.id === user.id);
        if (!alreadyInRoom) {
            room.users.push(user);
            room.votes[user.id] = null;
        }
        return room;
    }

    getRooms(): Room[] {
        return Array.from(this.rooms.values());
    }
}
