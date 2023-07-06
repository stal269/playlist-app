import React, { Component } from 'react';
import { ISong } from './song.model';
import './song.css';
const axios = require('axios');

export class SongItem extends Component<ISong> {
    render () {
        return (
            <li className="pl_song_item">
                <div className="pl_song_wrapper">
                    <button className="pl_delete" onClick={ this.handleDelete.bind(this) }>
                        <i className="fa fa-trash"></i>
                    </button>
                    <div className="pl_title" title={ this.props.title }>
                        { this.props.title }
                    </div>
                    <div className="pl_duration">{ this.props.duration }</div>
                </div>
            </li>
        );
    }

    private handleDelete (): void {
        axios.delete(`/playlist/songs/${ this.props.id }`)
            .then(() => {
                console.log(`song with id ${ this.props.id } succesfully deleted`);
            })
            .catch((error: Error) => {
                console.error(error);
            });
    }



}

