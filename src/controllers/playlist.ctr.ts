import { Request, Response, NextFunction } from 'express';
import { PlaylistSrv } from '../services/playlist.srv';
import playlistSrv from '../services/playlist.srv';
import googleApi, { GoogleApi } from '../services/google.api.srv';
import { SONG_ADDED_EVENT, SONG_DELETED_EVENT } from '../consts';

export class PlaylistCtr {

    clients = [];

    constructor (readonly playlistSrv: PlaylistSrv, readonly googleApi: GoogleApi) {
    }

    async getSongs (request: Request, response: Response): Promise<void> {
        const songs = await playlistSrv.getSongs();

        response
            .status(200)
            .json({ songs });
    }

    async addSong (request: Request, response: Response): Promise<void> {
        const inputSong: Song = request.body;
        const enrichedSongArray = await this.googleApi.setVideosMetadata([ inputSong ]);
        const enrichedSong = enrichedSongArray[ 0 ];
        const songId: string = await this.playlistSrv.addSong(enrichedSong);
        request.body.songId = songId;

        if (songId === null) {
            response.sendStatus(403);

            return;
        }

        response
            .status(200)
            .json({ songId });

        this.sendEventsToAll(SONG_ADDED_EVENT, enrichedSong);
    }

    deleteSong (request: Request, response: Response): void {
        const songId: string = request.params.id;
        this.playlistSrv.deleteSong(songId);
        response.sendStatus(200);
        this.sendEventsToAll(SONG_DELETED_EVENT, { id: songId });
    }

    eventsHandler (request: Request, response: Response): void {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };

        response.writeHead(200, headers);
        const clientId = Date.now();

        const newClient = {
            id: clientId,
            response
        };

        this.clients.push(newClient);

        request.on('close', () => {
            console.log(`${ clientId } Connection closed`);
            this.clients = this.clients.filter(client => client.id !== clientId);
        });
    }

    private sendEventsToAll (event, data): void {
        this.clients.forEach(client => client.response.write(this.getEventData(event, data)));
    }

    private getEventData (event, data): string {
        return `event: ${ event }\ndata: ${ JSON.stringify(data) }\n\n`;
    }

}

const playlistCtr = new PlaylistCtr(playlistSrv, googleApi);
export default playlistCtr;