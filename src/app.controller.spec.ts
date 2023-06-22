import { Test, TestingModule } from '@nestjs/testing';
import { SongsController } from './songs.controller';
import { AppService } from './app.service';

describe('AppController', () => {
    let songsController: SongsController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [ SongsController ],
            providers: [ AppService ],
        }).compile();

        songsController = app.get<SongsController>(SongsController);
    });

    describe('root', () => {
        it('should return "Hello World!"', () => {
            const createSong = {
                'url': 'https://www.youtube.com/watch?v=o62i5YUFRjc&list=PLyesBWGcaGGZp4O1auu5jkwAc5QmdlLZD&index=15',
                'id': 'o62i5YUFRjc'
            };
            expect(songsController.createSong(createSong)).toBe('o62i5YUFRjc');
        });
    });
});
