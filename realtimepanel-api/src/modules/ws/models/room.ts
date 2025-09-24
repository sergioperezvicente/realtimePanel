import { User } from "src/modules/auth/entities/user.entity";

export class Room {
    socketId: string;
    user: User
}
