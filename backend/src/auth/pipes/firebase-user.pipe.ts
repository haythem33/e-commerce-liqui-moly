import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

@Injectable()
export class FirebaseUserPipe implements PipeTransform {
  transform(firebase_user: any, metadata: ArgumentMetadata) {
    return {
      displayName: firebase_user.displayName,
      email: firebase_user.email,
      password:
        firebase_user.provider === 'INTERNAL' ? firebase_user.password : null,
      phoneNumber: firebase_user.phoneNumber,
      photoURL: firebase_user.photoURL,
      provider: firebase_user.provider,
      emailVerified: firebase_user.emailVerified,
      adresse: {
        street: firebase_user.street,
        city: firebase_user.city,
        state: firebase_user.state,
      },
    };
  }
}
