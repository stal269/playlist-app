import { ADD_SONG, DELETE_SONG, SONG_ADDED_EVENT, SONG_DELETED_EVENT } from '../consts';
import sio from '../index';

export class PlaylistSrv {

    private songs: Song[] = [];

    constructor () { this.init(); }

    init () {

    };

    addSong (song: Song): string {
        const newSong: Song = { ...song };
        if (this.isDuplicate(newSong)) return null;

        return newSong.id;
    }

    deleteSong (songId: string): void {
    };

    getSongs (): Song[] { return this.songs; }

    updatePlaylist (songs: Song[]) { this.songs = songs; }

    isDuplicate (newSong: Song): boolean {
        return !!this.songs.find((song: Song) =>
            song.id === newSong.id
        );
    }

}

const playlistSrv: PlaylistSrv = new PlaylistSrv();
export default playlistSrv;