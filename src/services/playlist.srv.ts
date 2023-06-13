export class PlaylistSrv {

    private songs: Song[] = [];

    constructor () { }

    async init () { };

    async addSong (song: Song): Promise<string> {
        const newSong: Song = { ...song };
        if (this.isDuplicate(newSong)) return null;
        this.songs.push(newSong);
        return newSong.id;
    }

    async deleteSong (songId: string): Promise<void> {
        this.songs = this.songs.filter(song => song.id != songId);
    };

    getSongs (): Song[] {
        return this.songs;
    }

    isDuplicate (newSong: Song): boolean {
        return !!this.songs.find((song: Song) =>
            song.id === newSong.id
        );
    }

}

const playlistSrv: PlaylistSrv = new PlaylistSrv();
export default playlistSrv;