import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socketService';

const TrackFinder = ({queue}) => {
    const [trackName, setTrackName] = useState('');
    const [tracks, setTracks] = useState([]);
    const [error, setError] = useState('');

    const shopId = window.location.pathname.split('/')[1]; // Get shopId from the URL
    const socket = getSocket();

    useEffect(() => {
        const handleFindTrackRes = (data) => {
            if (data.tracks) {
                setTracks(data.tracks);
                setError('');
            } else {
                setTracks([]);
                setError(data.message);
            }
        };

        if (socket) {
            socket.on('findTrackRes', handleFindTrackRes);
        }

        // Clean up on unmount
        return () => {
            if (socket) {
                socket.off('findTrackRes', handleFindTrackRes);
            }
        };
    }, [socket]);

    const handleSearch = () => {
        if (socket) {
            console.log(trackName)
            socket.emit('findTrack', { shopId, trackName });
        }
    };

    const handleClaim = () => {
        if (socket) {
            socket.emit('claimPlayer', { shopId });
        }
    };
    const handleSpotifyLogin = () => {
        const nextUrl = `http://localhost:5000/login/${shopId}`;
        window.location.href = nextUrl;
    };

    const addToQueue = (track) => {
        if (socket) {
            console.log(track)
            socket.emit('selectTrack', { shopId, track });
        }
    };

    return (
        <div>
            <button onClick={handleSpotifyLogin}>Login to Spotify</button>
            <h1>Find a Track</h1>
            <input 
                type="text" 
                value={trackName} 
                onChange={(e) => setTrackName(e.target.value)} 
                placeholder="Enter track name" 
            />
            <button onClick={handleSearch}>Search</button>
            <button onClick={handleClaim}>set as player</button>

            {error && <p>{error}</p>}
            {trackName == '' ?
            <ul>
                {queue && queue.map(track => (
                    <li key={track.id}>
                        <img src={track.thumbnail}/>
                        {track.title} - {track.artist}
                        <button onClick={() => addToQueue(track)}>Add to Queue</button>
                    </li>
                ))}
            </ul>:
            <ul>
                {tracks && tracks.map(track => (
                    <li key={track.id}>
                        <img src={track.thumbnail}/>
                        {track.title} - {track.artist}
                        <button onClick={() => addToQueue(track)}>Add to Queue</button>
                    </li>
                ))}
            </ul>
}
        </div>
    );
};

export default TrackFinder;
