import { Request, Response, NextFunction } from 'express';
import { PlaylistSrv } from '../services/playlist.srv';
import playlistSrv from '../services/playlist.srv';
import googleApi, { GoogleApi } from '../services/google.api.srv';

export class PlaylistCtr {

    constructor (readonly playlistSrv: PlaylistSrv, readonly googleApi: GoogleApi) {
    }

    getSongs (request: Request, response: Response): void {
        response
            .status(200)
            .json({ songs: playlistSrv.getSongs() });
    }

    async addSong (request: Request, response: Response, next: NextFunction): Promise<void> {
        const inputSong: Song = request.body;
        const enrichedSong = await this.googleApi.setVideosMetadata([ inputSong ]);
        const songId: string = this.playlistSrv.addSong(enrichedSong[ 0 ]);
        request.body.songId = songId;

        if (songId === null) {
            response.sendStatus(403);

            return;
        }

        response
            .status(200)
            .json({
                songId
            });

        next();
    }

    deleteSong (request: Request, response: Response, next: NextFunction): void {
        const songId: string = request.params.id;
        this.playlistSrv.deleteSong(songId);
        response.sendStatus(200);
        next();
    }

}

const playlistCtr = new PlaylistCtr(playlistSrv, googleApi);
export default playlistCtr;