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
      displayName: firebase_user.displayName || null,
      email: firebase_user.email,
      phoneNumber: firebase_user.phoneNumber || null,
      photoURL: firebase_user.photoURL,
      provider: firebase_user.provider,
      emailVerified: firebase_user.emailVerified,
      adresse: {
        street: firebase_user.street || null,
        city: firebase_user.city || null,
        state: firebase_user.state || null,
      },
    };
  }
}
