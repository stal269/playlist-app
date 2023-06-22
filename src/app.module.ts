import { Module } from '@nestjs/common';
import { SongsController } from './songs.controller';
import { AppService } from './app.service';

@Module({
    imports: [],
    controllers: [ SongsController ],
    providers: [ AppService ],
})
export class AppModule { }
