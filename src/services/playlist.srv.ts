export class PlaylistSrv {

    private songs: Song[] = [];

    addSong (song: Song): string {
        const newSong: Song = { ...song };
        if (this.isDuplicate(newSong)) return null;
        this.songs.push(newSong);

        return newSong.id;
    }

    deleteSong (songId: string): void {
        this.songs = this.songs.filter(song => song.id != songId);
    }

    getSongs (): Song[] {
        return this.songs;
    }

    updatePlaylist (songs: Song[]) {
        this.songs = songs;
    }

    isDuplicate (newSong: Song): boolean {
        return !!this.songs.find((song: Song) =>
            song.id === newSong.id
        );
    }

}

const playlistSrv: PlaylistSrv = new PlaylistSrv();
export default playlistSrv;