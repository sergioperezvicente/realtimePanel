import { User } from "@auth/entities/user.entity";

export interface Room {
    socket: string;
    user: User
    connected?: Date;
    disconnected?: Date;
}
