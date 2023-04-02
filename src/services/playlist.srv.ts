import { PLAYLIST_CHANNEL, PLAYLIST_KEY, REDIS_URL, SONG_ADDED_EVENT, SONG_DELETED_EVENT } from '../consts';
import { createClient } from 'redis';
import sio from '../index';
import { RedisClientType } from '@redis/client';

export class PlaylistSrv {

    private client: RedisClientType;
    private sub: RedisClientType;
    private pub: RedisClientType;
    private songs: Song[] = [];

    constructor () { this.init(); }

    async init () {
        this.client = createClient({ url: REDIS_URL });
        this.sub = createClient({ url: REDIS_URL });
        this.subscribe();
        this.pub = createClient({ url: REDIS_URL });
        await this.pub.connect();
        this.client.on('error', err => console.log('Redis Client Error', err));
        await this.client.connect();
        const songsStrs = await this.client.lRange(PLAYLIST_KEY, 0, -1);
        this.songs = songsStrs.map(song => JSON.parse(song));
    };

    async addSong (song: Song): Promise<string> {
        const newSong: Song = { ...song };
        if (this.isDuplicate([], newSong)) return null;
        const newSongStr = JSON.stringify(newSong);
        await this.client.rPush(PLAYLIST_KEY, newSongStr);

        await this.pub.publish(PLAYLIST_CHANNEL, JSON.stringify({
            event: SONG_ADDED_EVENT,
            payload: newSongStr
        }));

        return newSong.id;
    }

    async deleteSong (songId: string): Promise<void> {
        const deletedSong = this.songs.find(({ id }) => id === songId);
        await this.client.lRem(PLAYLIST_KEY, 1, JSON.stringify(deletedSong));

        await this.pub.publish(PLAYLIST_CHANNEL, JSON.stringify({
            event: SONG_DELETED_EVENT,
            payload: songId
        }));
    };

    async subscribe (): Promise<void> {
        await this.sub.connect();

        this.sub.subscribe(PLAYLIST_CHANNEL, (message, channel) => {
            const parsedMessage = JSON.parse(message);

            switch (parsedMessage.event) {
                case SONG_ADDED_EVENT:
                    this.songs.push(JSON.parse(parsedMessage.payload));
                    sio.emit(SONG_ADDED_EVENT, JSON.parse(parsedMessage.payload));
                    break;
                case SONG_DELETED_EVENT:
                    this.songs = this.songs.filter(({ id }) => id !== parsedMessage.payload);
                    sio.emit(SONG_DELETED_EVENT, { id: parsedMessage.payload });
                    break;
            }
        });

        this.sub.on('subscribe', (channel) => {
            console.log(`subscribed to channel: ${ channel }`);
        });
    }

    getSongs (): Song[] {
        return this.songs;
    }

    isDuplicate (songs: Song[], newSong: Song): boolean {
        return !!songs.find((song: Song) =>
            song.id === newSong.id
        );
    }

}

const playlistSrv: PlaylistSrv = new PlaylistSrv();
export default playlistSrv;