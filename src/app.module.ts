import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SongsService } from './services/songs/songs.service';
import { GoogleApiService } from './services/google-api/google-api.service';

@Module({
    imports: [
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'frontend', 'dist'),
        }),
    ],
    controllers: [ SongsController ],
    providers: [ SongsService, GoogleApiService ],
})
export class AppModule { }
