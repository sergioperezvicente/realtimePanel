import { User } from "src/modules/auth/entities/user.entity";

export class Room {
    socket: string;
    user: User
    connected?: Date;
    disconnected?: Date;
}
