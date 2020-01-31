import {Component} from 'react';
import React from 'react';
import './song-input.css';
const axios = require('axios');

export class SongInput extends Component<any, {value: string}> {

    constructor(props: any) {
        super(props);
        this.state = {value: ''}
    }

    render() {
        return (
            <div className="pl_input_wrapper">
                <input 
                    placeholder="Enter Video URL" 
                    className="pl_input" 
                    type="text" 
                    value={this.state.value} 
                    onChange={this.handleChange.bind(this)}
                    />
                <button 
                    disabled={!this.state.value.length} 
                    className="pl_add_button" 
                    onClick={this.addSong.bind(this)}>Add
                </button>
            </div>
        );
    }

    private addSong(): void {
        axios.post('/playlist/songs', {
            url: this.state.value
        })
        .then((response: { data: { id: number}}) => {
            console.log(`song with id ${response.data.id} was added to playlist`);
        })
        .catch((error: Error) => {
            console.log(error);
            const status: number = (error as any).response.status;

            if (status === 400) {
                window.alert('no such url exists');
            }

            if (status === 403) {
                window.alert('video already exists in playlist');
            }
        });
    }

    private handleChange(event: any): void {
        this.setState({value: event.target.value})
    }
}


