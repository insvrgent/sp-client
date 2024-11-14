import React, { useState, useEffect, useRef } from 'react';
import YouTube from 'react-youtube';

export function MusicPlayer({ next }) {
  // State to store the progress in milliseconds, video duration, and the next video ID
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(null); // Initial video ID
  const [nextTrack, setNextTrack] = useState(null); // Initial video ID
  const [isNearEnd, setIsNearEnd] = useState(false); // Flag for 20 seconds left
  const playerRef = useRef(null);

  useEffect(() => {
    if (next == null) return;
    if (currentTrack == null) setCurrentTrack(next);
    setNextTrack(next);
  }, [next]);

  const handlePlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {

      // Start tracking progress once the video starts playing
      const interval = setInterval(() => {
        if (playerRef.current) {
          const currentTime = playerRef.current.getCurrentTime(); // Get current time in seconds
          setProgress(currentTime * 1000); // Convert to milliseconds
          // Check if the video is 20 seconds from ending
          if (currentTime >= duration / 1000 - 20 && !isNearEnd) {
            setIsNearEnd(true);
          } else if (currentTime < duration / 1000 - 20 && isNearEnd) {
            setIsNearEnd(false);
          }
        }
      }, 100); // Update every 100 ms

      // Clean up when the video is paused or finished
      event.target.addEventListener('onStateChange', (e) => {
        if (e.data === window.YT.PlayerState.PAUSED || e.data === window.YT.PlayerState.ENDED) {
          clearInterval(interval);

          // When the video ends, set the next track
          if (e.data === window.YT.PlayerState.ENDED) {
            // Logic to set the next video ID (for now, just updating to another static video)
            setCurrentTrack(nextTrack); // Replace 'newVideoId' with the ID of the next video you want
          }
        }
      });
    }
  };

  const handlePlayerReady = (event) => {
    playerRef.current = event.target;
    const durationInSeconds = playerRef.current.getDuration(); // Get video duration in seconds
    setDuration(durationInSeconds * 1000); // Set the duration in milliseconds

    // Set the video quality to the lowest available (typically 360p or smaller)
    playerRef.current.setPlaybackQuality('small');
  };

  useEffect(() => {
    // Make sure to load the YouTube iframe API script when the component mounts
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(script);

    return () => {
      // Cleanup if needed (for example, removing the script)
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    // When the currentTrack changes, reset progress and duration
    setProgress(0);
    setDuration(0);
    setIsNearEnd(false);
  }, [currentTrack]);

  return (
    <div className="App">
      <h1>Hello React.</h1>
      <h2>Start editing to see some magic happen!</h2>
      {currentTrack != null && (
        <div>
          <YouTube
            videoId={currentTrack.videoId} // Dynamically change video based on currentTrack
            opts={{
              height: '315',
              width: '560',
              playerVars: {
                autoplay: 1,
                controls: 1,
                mute: 0,
                loop: 0, // Do not loop; handle next video manually
                quality: 'small', // Request small quality (360p or lower)
              },
            }}
            onReady={handlePlayerReady} // Get duration and set quality on ready
            onStateChange={handlePlayerStateChange}
          />
        </div>
      )}
      <div>Progress: {progress} ms</div>
      <div>Video Duration: {duration} ms</div>
      <div>
        {isNearEnd && <div>Video is near the end (20 seconds left)</div>}
      </div>
    </div>
  );
}
