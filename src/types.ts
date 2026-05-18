export type SongFull = {
    album: string;
    artist: string;
    name: string;
};

export type SongDB = SongFull & { musicbrainzId: number }

export type Recording = {
    "first-release-date": string;
}