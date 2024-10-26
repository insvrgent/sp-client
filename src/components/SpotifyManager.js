import React, { useState, useEffect } from 'react';
import { getSocket } from '../services/socketService';

const TrackFinder = () => {
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
            socket.emit('findTrack', { shopId, trackName });
        }
    };

    const handleSpotifyLogin = () => {
        const nextUrl = `http://localhost:5000/login/${shopId}`;
        window.location.href = nextUrl;
    };

    const addToQueue = (trackId) => {
        if (socket) {
            socket.emit('selectTrack', { shopId, trackId });
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

            {error && <p>{error}</p>}
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>
                        {track.name} - {track.artists.map(artist => artist.name).join(', ')}
                        <button onClick={() => addToQueue(track.id)}>Add to Queue</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrackFinder;
