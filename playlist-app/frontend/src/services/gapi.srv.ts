import {ISong} from '../components/song/song.model';
import {Duration} from 'luxon';

declare let gapi: any;

class GoogleApi {

    private static readonly videosPath: string = 'https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&';

    setVideosMetadata(songs: ISong[]): Promise<void> {
        if (!songs.length) {
            return Promise.resolve();
        }

        const videoIds: string = songs.map((song: ISong) => song.id).join(',');

        return gapi.client.request({
            path: `${GoogleApi.videosPath}id=${videoIds}`
        })
        .then((response: any) => {
            songs.forEach((song: ISong, index: number) => {
                const resItems = response.result.items;
                song.title = resItems[index].snippet.title.trim();
                song.duration = this.getDurationStr(resItems[index].contentDetails.duration);
            });
        })
        .catch((error: Error) => {
            console.log(error);
        })
    }

    private getDurationStr(durationIso: string) {
        return Duration.fromISO(durationIso).toFormat('hh:mm:ss');
    }   

}

export const gapiClient: GoogleApi = new GoogleApi();