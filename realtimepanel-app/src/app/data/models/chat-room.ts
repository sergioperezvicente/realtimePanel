import { User } from "./user";

export interface ChatRoom {
    socket: string;
    user: User;
    connected?: Date;
    disconnected: Date;
}