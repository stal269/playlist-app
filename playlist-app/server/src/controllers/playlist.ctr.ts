import {Request, Response, NextFunction} from 'express';
import {PlaylistSrv} from '../services/playlist.srv';
import  playlistSrv from '../services/playlist.srv';

export class PlaylistCtr {

    constructor(readonly playlistSrv: PlaylistSrv){
    }

    getSongs(request: Request, response: Response): void {
        response
            .status(200)
            .json({
                songs: playlistSrv.getSongs()
            });
    }

    addSong(request: Request, response: Response, next: NextFunction): void {
        const inputSong: Song = request.body;
        const songId: string = this.playlistSrv.addSong(inputSong);
        request.body.songId = songId;
        
        if (songId === null) {
            response.sendStatus(403)

            return;
        }

        response
            .status(200)
            .json({
                songId
            });

        next();
    }

    deleteSong(request: Request, response: Response, next: NextFunction): void {
        const songId: string = request.params.id;
        this.playlistSrv.deleteSong(songId);
        response.sendStatus(200);
        next();
    }

}

const playlistCtr = new PlaylistCtr(playlistSrv);
export default playlistCtr;