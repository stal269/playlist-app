import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CreateSong, Song } from './models/song.model';
import { PopulateIdPipe } from './pipes/populate-id/populate-id.pipe';
import { SongsService } from './services/songs/songs.service';

// TODO: we might need to inject res, because we need too control the status code
// TODO: we might need too use @Header in the case of SSE, but small chance
@Controller('playlist/songs')
export class SongsController {
    constructor (private readonly catsService: SongsService) { }

    @Get()
    retrieveSongs (): Song[] {
        return this.catsService.getSongs();
    }

    @Post()
    createSong (@Body(PopulateIdPipe) song: CreateSong): { id: string; } {
        console.log(song);
        this.catsService.addSong(song);

        return { id: song.id };
    }

    @Delete(':id')
    deleteSong (@Param('id') id: string): { id: string; } {
        this.catsService.deleteSong(id);

        return { id };
    }
}
