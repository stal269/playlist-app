import * as express from 'express';
import {Express, Request, Response, NextFunction} from 'express';
import * as path from 'path';
import * as bodyParser from'body-parser';
import playlistCtr from './controllers/playlist.ctr';
const getVideoId = require('get-video-id');

class App {

  public express: Express;
  private io;

  constructor () {
    this.express = express();
    this.mountRoutes();
  }

  public setSocketIO(io) {
    this.io = io;
  }

  private mountRoutes(): void {
    this.express
      .use('/', express.static(path.join(__dirname, '../..', 'client', 'dist')))
      .post('/playlist/songs', bodyParser.json(),
         this.populateSongId.bind(this),
         playlistCtr.addSong.bind(playlistCtr),
         this.notifySongAdded.bind(this)
      )
      .delete('/playlist/songs/:id', 
        playlistCtr.deleteSong.bind(playlistCtr),
        this.notifySongDeleted.bind(this)
      )
      .get('/playlist/songs', playlistCtr.getSongs.bind(playlistCtr));
  }

  private notifySongAdded(request: Request): void {
    this.io.emit('add', request.body);
  }

  private notifySongDeleted(request: Request): void {
    this.io.emit('delete', {
      id: request.params.id
    });
  }

  private populateSongId(request: Request, response: Response, next: NextFunction) {
    const inputSong: Song = request.body;
    const url: string = inputSong.url;
    request.body.id = getVideoId(url).id;
    
    if (!request.body.id) {
        response.sendStatus(400)
        
        return;
    }

    next();
  }
}

export default new App();
