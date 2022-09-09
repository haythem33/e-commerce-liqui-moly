import { Injectable, OnApplicationBootstrap } from '@nestjs/common';

@Injectable()
export class AdminServiceService implements OnApplicationBootstrap {
  onApplicationBootstrap() {
    console.log('INSERT ADMIN');
  }
}
