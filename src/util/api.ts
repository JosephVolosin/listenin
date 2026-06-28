import type { Recording, Release, SongDB } from '../types';
import { convertDateToObj } from './util';

export class MusicAPI {
	readonly musicBrainzAPI: string = 'https://musicbrainz.org/ws/2';
	readonly coverArtArchiveAPI: string = 'https://coverartarchive.org';
	readonly userAgent: string = 'listenin/0.0.1 ( josephvolosin@gmail.com )';

	public async getSong(name: string, artist: string, album: string): Promise<SongDB | null> {
		const headers = new Headers({
			Accept: 'application/json',
			'User-Agent': this.userAgent
		});

		const params = new URLSearchParams();
		params.append('fmt', 'json');
		params.append('query', `recording: "${album}" AND artist:"${artist}"`);

		const response = await fetch(`${this.musicBrainzAPI}/recording?${params}`, {
			method: 'GET',
			headers: headers
		});
		const responseData: { recordings: Recording[] } = await response.json();
		if (responseData.recordings.length > 0) {
			const recordings: Recording[] = responseData.recordings;
			const albumReleases: Release[] = recordings.reduce(
				(albumReleases: Release[], recording: Recording) => {
					const releases: Release[] = recording.releases;
					if (releases !== undefined) {
						// Filter for only those that contain the given album title
						const matchedReleases = releases.filter((release: Release) => {
							return release.title.toUpperCase() == album.toUpperCase();
						});
						albumReleases = albumReleases.concat(matchedReleases);
					}
					return albumReleases;
				},
				[]
			);
			if (albumReleases.length > 0) {
				// Find the earliest release to use as the truth
				albumReleases.sort((albumRelease) => convertDateToObj(albumRelease.date)?.toMillis() ?? 0);
				return new Promise<SongDB | null>((resolve) =>
					resolve({
						album: album,
						artist: artist,
						name: name,
						musicbrainzIds: albumReleases.map((release) => release.id)
					})
				);
			}
		} else {
			console.error(`"${album}" by "${artist}" was not found`);
		}
		return new Promise<SongDB | null>((resolve) => resolve(null));
	}

	public async getAlbumArt(musicBrainzID: string): Promise<string | null> {
		const headers = new Headers({
			Accept: 'application/json'
		});

		const response = await fetch(`${this.coverArtArchiveAPI}/release/${musicBrainzID}`, {
			method: 'GET',
			headers: headers
		});
		if (response.ok) {
			const responseData = await response.json();
			if (responseData.images.length > 0) {
				return new Promise<string | null>((resolve) => resolve(responseData.images[0].image));
			}
		}

		return new Promise<string | null>((resolve) => resolve(null));
	}
}
