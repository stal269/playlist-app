import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
const getVideoId = require('get-video-id');

@Injectable()
export class PopulateIdPipe implements PipeTransform {

    transform (value: any, metadata: ArgumentMetadata) {
        const url: string = value.url;
        value.id = getVideoId(url).id;
        if (!value.id) throw new BadRequestException('id is missing in the url');

        return value;
    }
}
