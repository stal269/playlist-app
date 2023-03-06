import { Producer, KafkaClient, Consumer } from 'kafka-node';
import { TOPIC_NAME, ADD_SONG, DELETE_SONG, KAFKA_HOST, TOPIC_GRACE_PERIOD, TOPIC_PROP_INIT, SONG_ADDED_EVENT, SONG_DELETED_EVENT, CONSUMER_MESSAGE_EVENT, PRODUCER_READY_EVENT, CONSUMER_ERROR_EVENT } from '../consts';
import sio from '../index';

export class PlaylistSrv {

    private client: KafkaClient;
    private producer: Producer;
    private consumer: Consumer;
    private songs: Song[] = [];

    constructor () { this.init(); }

    init () {
        this.client = new KafkaClient({ kafkaHost: KAFKA_HOST });
        this.producer = new Producer(this.client);
        this.producer.on(PRODUCER_READY_EVENT, () => { console.log('producer is ready'); });
        this.initConsumer();

        this.consumer.on(CONSUMER_ERROR_EVENT, (error) => {
            console.log(error);
            setTimeout(() => { this.initConsumer(); }, TOPIC_GRACE_PERIOD);
        });

    };

    initConsumer (): void {
        this.consumer = new Consumer(this.client, [ { [ TOPIC_PROP_INIT ]: TOPIC_NAME } ], { fromOffset: true });
        this.consumer.setOffset(TOPIC_NAME, 0, 0);

        this.consumer.on(CONSUMER_MESSAGE_EVENT, (message: any) => {
            switch (message.key) {
                case ADD_SONG:
                    const parsedMessage = JSON.parse(message.value);
                    this.songs = [ ...this.songs, parsedMessage ];
                    sio.emit(SONG_ADDED_EVENT, parsedMessage);
                    break;
                case DELETE_SONG:
                    this.songs = this.songs.filter(song => song.id != message.value);
                    sio.emit(SONG_DELETED_EVENT, { id: message.value });
                    break;
            }
        });
    }

    addSong (song: Song): string {
        const newSong: Song = { ...song };
        if (this.isDuplicate(newSong)) return null;

        this.producer.send([ {
            topic: TOPIC_NAME,
            messages: [ JSON.stringify(newSong) ],
            key: ADD_SONG
        } ], () => { });

        return newSong.id;
    }

    deleteSong (songId: string): void {
        this.producer.send([ {
            topic: TOPIC_NAME,
            messages: [ songId ],
            key: DELETE_SONG
        } ], () => { });
    };

    getSongs (): Song[] { return this.songs; }

    updatePlaylist (songs: Song[]) { this.songs = songs; }

    isDuplicate (newSong: Song): boolean {
        return !!this.songs.find((song: Song) =>
            song.id === newSong.id
        );
    }

}

const playlistSrv: PlaylistSrv = new PlaylistSrv();
export default playlistSrv;