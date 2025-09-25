import { Injectable } from '@nestjs/common';
import { User } from '../auth/entities/user.entity';
import { WsGateway } from './ws.gateway';

@Injectable()
export class WsService {


    handleDisconnectUser(user: User){
    }
//     create(createWDto: CreateWDto) {
//     return 'This action adds a new w';
//   }

//   findAll() {
//     return `This action returns all ws`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} w`;
//   }

//   update(id: number, updateWDto: UpdateWDto) {
//     return `This action updates a #${id} w`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} w`;
//   }
}
