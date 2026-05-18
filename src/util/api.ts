import type { Recording, SongDB } from "../types";

export class MusicBrainz {
    readonly apiUrl: string = "https://musicbrainz.org/ws/2";
    readonly userAgent: string = "listenin/0.0.1 ( josephvolosin@gmail.com )"
    
    public async getSong(name: string, artist: string): Promise<SongDB | null> {
        const headers = new Headers({
            "Accept": "application/json",
            "User-Agent": this.userAgent
        });
        
        const params = new URLSearchParams();
        params.append("fmt", "json");
        params.append("query", `recording: "${name}" AND artist:"${artist}" NOT "live"`)

        const response = await fetch(`${this.apiUrl}/recording?${params}`, {
            method: 'GET',
            headers: headers
        });
        const responseData = await response.json();
        if (responseData.recordings.length > 0) {
            console.log(responseData.recordings);
            console.log(responseData.recordings["first-release-date"]);
            // Use the reference from above, below
            // const firstRelease = responseData.recordings.reduce((recording: Recording, earliest: Recording) => {
            //     console.log(recording.firstRelease)
            //     if (!earliest) {
            //         return recording;
            //     } else if (recording.firstRelease < earliest.firstRelease) {
            //         return recording;
            //     } else {
            //         return earliest;
            //     }
            // }, null);
        }
        return new Promise<SongDB | null>((resolve) => resolve(null));
    }
}