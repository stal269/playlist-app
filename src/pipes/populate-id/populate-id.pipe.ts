import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { GoogleApiService } from 'src/services/google-api/google-api.service';
const getVideoId = require('get-video-id');

@Injectable()
export class PopulateIdPipe implements PipeTransform {

    constructor (private googleApi: GoogleApiService) { }

    async transform (value: any, metadata: ArgumentMetadata) {
        const url: string = value.url;
        value.id = getVideoId(url).id;
        if (!value.id) throw new BadRequestException('id is missing in the url');
        const enrichedValue = await this.googleApi.setVideosMetadata([ value ])[ 0 ];

        return {
            ...value,
            ...enrichedValue
        };
    }
}
