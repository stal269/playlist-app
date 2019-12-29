import React, {Component} from 'react';
import {Playlist} from './components/playlist/playlist.cmp';
import {ISong} from './components/song/song.model';
import io from 'socket.io-client';
import './app.css';
import {gapiClient} from './services/gapi.srv'
const axios = require('axios');
declare let YT: any;

export class App extends Component<any, ISongsContainer> {

  private static YOUTUBE_PLAYER_SOURCE_URL = 'https://www.youtube.com/iframe_api';
  private player: any = null;
  private socket: any = io;

  constructor(props: any) {
    super(props);
    this.socket = io();

    this.state = {
      songs: []
    };
  }

  componentDidMount() {
    this.loadYoutubePlayer();
    this.registerSocketIOListeners();
  }

  render() {
    return (
      <div className="pl_app">
        <Playlist songs={this.state.songs}/>
        <div className="pl_player">
          <div id="player"></div>
        </div>
      </div>
    );
  }

  private loadSongs(): void {
    axios.get('/playlist/songs')
      .then((response: { data: {songs: ISong[] }}) => {
        gapiClient.setVideosMetadata(response.data.songs)
          .then(() => {
            this.setState(response.data);
            this.playNextSong();
          });
        })
        .catch((error: Error) => {
          console.error(error);
        });
  }

  private onYouTubeIframeAPIReady(): void {
    new YT.Player('player', {
      height: '500',
      width: '800',
      playerVars: {
        controls: 0,
        disablekb: 1,
        autohide: 1
      },
      events: {
        'onReady': this.onPlayerReady.bind(this),
        'onStateChange': this.onPlayerStateChange.bind(this)
      }
    });
  }

  private onPlayerReady(event: any): void {
    this.player = event.target;
    this.loadSongs();
  }

  private onPlayerStateChange(event: any): void {
    if (event.data == YT.PlayerState.ENDED) {
      this.setState({
        songs: this.state.songs.slice(1)
      });

      this.playNextSong();
    }
  }

  private loadYoutubePlayer(): void {
    const tag = document.createElement('script');
    tag.src = App.YOUTUBE_PLAYER_SOURCE_URL;
    document.body.append(tag);
    (window as any).onYouTubeIframeAPIReady = this.onYouTubeIframeAPIReady.bind(this);
  }

  private playNextSong(): void {
    if (this.state.songs.length) {
      this.player.loadVideoById(this.state.songs[0].id);
    }
  }

  private registerSocketIOListeners() {
    this.socket.on('add', (song: ISong) => {
      const isFirstSong: boolean = !this.state.songs.length;

      gapiClient.setVideosMetadata([song])
          .then(() => {
            this.state.songs.push(song);

            this.setState({
              songs: this.state.songs
            });

            if (isFirstSong) {
              this.playNextSong();
            }
        });
    });

    this.socket.on('delete', (deleteMessage: {id: string}) => {
      if (!this.state.songs.length) {
        return;
      }

      const firstSongId: string = this.state.songs[0].id;

      this.setState({
        songs: this.state.songs.filter((song: ISong) => song.id !== deleteMessage.id)
      });

      if (firstSongId === deleteMessage.id) {
        if (!this.state.songs.length) {
          this.player.stopVideo(); //todo: should check if enough

          return;
        }

        this.playNextSong();
      }
    })
  }
}

export interface ISongsContainer {
  songs: ISong[]
}