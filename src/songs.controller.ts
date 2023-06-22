import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSong, Song } from './models/song.model';
import { PopulateIdPipe } from './pipes/populate-id/populate-id.pipe';

// TODO: we might need to inject res, because we need too control the status code
// TODO: we might need too use @Header in the case of SSE, but small chance
@Controller('playlist/songs')
export class SongsController {
    constructor (private readonly appService: AppService) { }

    @Get()
    retrieveSongs (): Song[] {
        return [];
    }

    // we can whitelist the properties that we want
    // 1. url
    // 2. id (but it should come from a middleware)
    // how do we do middleware in nest
    @Post()
    createSong (@Body(new PopulateIdPipe()) song: CreateSong): string {
        return song.id;
    }

    @Delete(':id')
    deleteSong (@Param('id') id: string): void {

    }
}
