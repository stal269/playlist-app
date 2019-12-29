import React, {Component} from 'react';
import {SongItem} from '../song/song.cmp';
import {ISong} from '../song/song.model';
import {SongInput} from '../SongInput/song_input.cmp';
import {ISongsContainer} from '../../app';
import './playlist.css';

export class Playlist extends Component<ISongsContainer> {

    render() {
        return (
            <div className="pl_playlist_wrapper">
                <SongInput/>
                <ul className="pl_playlist">
                    {this.props.songs.map((song: ISong, index: number) => this.renderSong(song, index))}
                </ul>
            </div>
        );
    }

    private renderSong(song: ISong, key: number) {
        return (<SongItem key={key} {...song}/>)
    }

}

