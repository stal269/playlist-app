export interface CreateSong {
    url: string;
    id: string;
}

export interface Song extends CreateSong {
    title: string;
    duration: string;
}