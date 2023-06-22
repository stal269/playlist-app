import { PartialType } from '@nestjs/mapped-types';

export class Song {
    id: string;
    url: string;
    title: string;
    duration: string;
}

// TODO: try answering the question if its better than PickType sometime
export class CreateSong extends PartialType(Song) { }