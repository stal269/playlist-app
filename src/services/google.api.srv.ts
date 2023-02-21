const { google } = require('googleapis');
import { Duration } from 'luxon';

export class GoogleApi {

    youtube = google.youtube(
        {
            version: 'v3',
            auth: 'AIzaSyAc6rcxHMf-u63ZpUYxTjnagpwcsJFVHXk'
        });

    async setVideosMetadata (songs: Song[]) {
        const videoIds: string = songs.map((song: Song) => song.id).join(',');

        const response = await this.youtube.videos.list({
            id: videoIds,
            part: 'snippet, contentDetails'
        });

        const { items } = response.data;

        items.forEach(({ snippet, contentDetails }, idx) => {
            songs[ idx ].title = snippet.title;
            songs[ idx ].duration = this.getDurationStr(contentDetails.duration);
        });

        return songs;
    }

    private getDurationStr (durationIso: string) {
        return Duration.fromISO(durationIso).toFormat('hh:mm:ss');
    }

}

const googleApi: GoogleApi = new GoogleApi();
export default googleApi;