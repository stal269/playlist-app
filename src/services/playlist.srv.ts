import { Producer, KafkaClient, Consumer } from 'kafka-node';
import { TOPIC_NAME, ADD_SONG, DELETE_SONG } from '../consts';
import sio from '../index';

const kafka = require('kafka-node');

export class PlaylistSrv {

    private client;
    private producer;
    private consumer;
    private songs: Song[] = [];

    constructor () {
        this.init();
    }

    init () {
        setTimeout(() => {

        });
        this.client = new KafkaClient({ kafkaHost: 'kafka:9092' });
        this.producer = new Producer(this.client);

        this.producer.on('ready', () => {
            console.log('producer is ready');
        });

        this.initConsumer();

        this.consumer.on('error', (error) => {
            console.log(error);

            setTimeout(() => {
                this.initConsumer();
            }, 30000);
        });

    };

    initConsumer (): void {
        this.consumer = new Consumer(this.client, [ { 'topic': TOPIC_NAME } ], { fromOffset: true });

        this.consumer.setOffset(TOPIC_NAME, 0, 0);

        this.consumer.on('message', (message) => {
            switch (message.key) {
                case ADD_SONG:
                    const parsedMessage = JSON.parse(message.value);
                    this.songs = [ ...this.songs, parsedMessage ];
                    console.log('after song added', this.songs);
                    sio.emit('add', parsedMessage);
                    break;
                case DELETE_SONG:
                    this.songs = this.songs.filter(song => song.id != message.value);
                    console.log('deleting', message.value);
                    sio.emit('delete', { id: message.value });
                    break;
            }
        });
    }

    addSong (song: Song): string {
        const newSong: Song = { ...song };
        if (this.isDuplicate(newSong)) return null;

        this.producer.send([
            {
                topic: TOPIC_NAME,
                messages: [ JSON.stringify(newSong) ],
                key: ADD_SONG
            }
        ], () => { });

        return newSong.id;
    }

    deleteSong (songId: string): void {
        this.producer.send([
            {
                topic: TOPIC_NAME,
                messages: [ songId ],
                key: DELETE_SONG
            }
        ], () => { });
    };

    getSongs (): Song[] {
        console.log(this.songs);
        return this.songs;
    }

    updatePlaylist (songs: Song[]) {
        this.songs = songs;
    }

    isDuplicate (newSong: Song): boolean {
        return !!this.songs.find((song: Song) =>
            song.id === newSong.id
        );
    }

}

const playlistSrv: PlaylistSrv = new PlaylistSrv();
export default playlistSrv;