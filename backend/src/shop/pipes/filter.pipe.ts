import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FilterPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return JSON.parse(value);
  }
}
