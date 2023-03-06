const { google } = require('googleapis');
require('dotenv').config();
import { Duration } from 'luxon';
import { DURATION_FORMAT, VIDEO_METADATA_PARTS, YOUTUBE_API_VERSION } from '../consts';

export class GoogleApi {

    youtube = google.youtube({
        version: YOUTUBE_API_VERSION,
        auth: process.env.API_TOKEN
    });

    async setVideosMetadata (songs: Song[]) {
        const videoIds: string = songs.map((song: Song) => song.id).join(',');

        const response = await this.youtube.videos.list({
            id: videoIds,
            part: VIDEO_METADATA_PARTS
        });

        const { items } = response.data;

        items.forEach(({ snippet, contentDetails }, idx: number) => {
            songs[ idx ].title = snippet.title;
            songs[ idx ].duration = this.getDurationStr(contentDetails.duration);
        });

        return songs;
    }

    private getDurationStr (durationIso: string) {
        return Duration.fromISO(durationIso).toFormat(DURATION_FORMAT);
    }

}

const googleApi: GoogleApi = new GoogleApi();
export default googleApi;