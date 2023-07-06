import { Injectable } from '@nestjs/common';
import { CreateSong, Song } from 'src/models/song.model';

@Injectable()
export class SongsService {

    private songs: Song[] = [];

    addSong (song: CreateSong): string {
        const newSong = { ...song };
        if (this.isDuplicate(<Song> newSong)) return null;
        this.songs.push(<Song> newSong);
        return newSong.id;
    }

    deleteSong (songId: string): void {
        this.songs = this.songs.filter(song => song.id != songId);
    };

    getSongs (): Song[] {
        return this.songs;
    }

    private isDuplicate (newSong: Song): boolean {
        return !!this.songs.find((song: Song) =>
            song.id === newSong.id
        );
    }
}
