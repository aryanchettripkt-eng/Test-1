export interface Track {
  id: string;
  title: string;
  artist: string;
  albumArt: string;
  url: string;
  genre: string;
}

export const LOCAL_TRACKS: Track[] = [
  {
    id: 't1',
    title: 'Midnight City',
    artist: 'M83',
    albumArt: 'https://picsum.photos/seed/m83/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    genre: 'Synthwave'
  },
  {
    id: 't2',
    title: 'Lofi Study',
    artist: 'Chillhop Music',
    albumArt: 'https://picsum.photos/seed/lofi/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    genre: 'Lofi'
  },
  {
    id: 't3',
    title: 'Nostalgia',
    artist: 'Memory Lane',
    albumArt: 'https://picsum.photos/seed/nostalgia/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    genre: 'Ambient'
  },
  {
    id: 't4',
    title: 'Summer Breeze',
    artist: 'Vintage Vibes',
    albumArt: 'https://picsum.photos/seed/summer/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    genre: 'Pop'
  },
  {
    id: 't5',
    title: 'Rainy Night',
    artist: 'Jazz Trio',
    albumArt: 'https://picsum.photos/seed/rainy/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    genre: 'Jazz'
  },
  {
    id: 't6',
    title: 'Golden Hour',
    artist: 'Acoustic Dreams',
    albumArt: 'https://picsum.photos/seed/golden/400/400',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3',
    genre: 'Acoustic'
  }
];
