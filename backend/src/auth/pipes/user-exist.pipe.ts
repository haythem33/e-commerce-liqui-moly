import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class UserExistPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    if (
      !value.hasOwnProperty('username') ||
      !value.hasOwnProperty('email') ||
      !value.hasOwnProperty('password')
    ) {
      throw new BadRequestException('BAD FORMAT');
    }
  }
}
