import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class PopulateIdPipe implements PipeTransform {
    transform (value: any, metadata: ArgumentMetadata) {
        const val = parseInt(value, 10);
        return value;
    }
}
