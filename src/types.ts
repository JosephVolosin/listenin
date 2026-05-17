export type SongFull = {
    album: string;
    artist: string;
    name: string;
};

export type SongDB = SongFull & { musicbrainzIds: string[] }

export type Release = {
  id: string,
  'artist-credit-id': string,
  title: string,
  status: string,
  date: string,
  country: string 
}

/** Represents a recording returned from the Musicbrainz API
 * Not all fields are included as they are not all important.
*/
export type Recording = {
    id: string;
    title: string;
    length: string;
    "artist-credit": {
        name: string;
        artist: {
            id: string;
            name: string;
        }
    },
    releases: Release[],
    date: string;
    tags: {
        count: number;
        name: string;
    }[];
};

export type User = {
  username: string;
  lastPlayed: SongFull;
};