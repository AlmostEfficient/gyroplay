"use client"
import Image from 'next/image'
import styles from './page.module.css'
import YouTube from 'react-youtube';
import { useState, useEffect } from 'react';

export default function Home() {
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [video1Playing, setVideo1Playing] = useState(true);
  const [video1Volume, setVideo1Volume] = useState(100); // 100% volume

  const [video2Playing, setVideo2Playing] = useState(true);
  const [video2Volume, setVideo2Volume] = useState(0); // 0% volume

  function playAllVideos() {
    video1Ref.playVideo();
    video2Ref.playVideo();
  }
  
  useEffect(() => {
    const handleOrientation = (event) => {
      const { alpha, beta, gamma } = event;
      setGyroData({ alpha, beta, gamma });
    };

    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  function handleOrientation(event) {
    const { alpha, beta, gamma } = event;
    setGyroData({ alpha, beta, gamma });

    const normalizedBeta = (beta + 180) / 360;

    const calculatedVideo1Volume = Math.floor(100 * (1 - normalizedBeta));
    const calculatedVideo2Volume = Math.floor(100 * normalizedBeta);

    // Update the state with the calculated volumes
    setVideo1Volume(calculatedVideo1Volume);
    setVideo2Volume(calculatedVideo2Volume);
  }

  function requestGyroAccess() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      DeviceOrientationEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation);
          }
        })
        .catch(console.error);
    } else {
      // For non-iOS 13+ devices
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }
  
  const videoOptions = {
    height: '195',
    width: '320',
    playerVars: {
      // https://developers.google.com/youtube/player_parameters
      autoplay: 1, // Auto-play the video on load
    },
  };

  let video1Ref = null;
  let video2Ref = null;

  const onVideo1Ready = (event) => {
    video1Ref = event.target;
  };

  const onVideo2Ready = (event) => {
    video2Ref = event.target;
  };

  useEffect(() => {
    if (video1Ref) {
      video1Ref.setVolume(video1Volume);
    }
  }, [video1Volume]);
  
  useEffect(() => {
    if (video2Ref) {
      video2Ref.setVolume(video2Volume);
    }
  }, [video2Volume]);  

  useEffect(() => {
    if (video1Ref) {
      video1Ref.setVolume(video1Volume);
    }
  }, [video1Volume]);
  
  useEffect(() => {
    if (video2Ref) {
      video2Ref.setVolume(video2Volume);
    }
  }, [video2Volume]);

  useEffect(() => {
    if (video2Ref) {
      video2Ref.setVolume(0); // Set initial volume to 0
    }
  }, [])

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>
            Welcome to <a href="https://nextjs.org">Gyroplay!</a>
        </h1>
        <div>
          <p>Phone X axis value: {gyroData.beta}</p>
        </div>
        <button className={styles.button} onClick={requestGyroAccess}>Request Gyroscope Access</button>
        <button className={styles.button} onClick={playAllVideos}>Play All</button>
      </div>
  
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <YouTube videoId="y6120QOlsfU" opts={videoOptions} onReady={onVideo1Ready} />
          <div>Volume: {video1Volume}%</div>
          <div className={styles.controls}>
            <button onClick={() => setVideo1Volume(Math.min(video1Volume + 10, 100))}>+ Volume</button>
            <button onClick={() => {
              if (video1Playing) {
                video1Ref.pauseVideo();
              } else {
                video1Ref.playVideo();
              }
              setVideo1Playing(!video1Playing);
            }}>
              {video1Playing ? "Pause" : "Play"}
            </button>
            <button onClick={() => setVideo1Volume(Math.max(video1Volume - 10, 0))}>- Volume</button>
          </div>
        </div>
  
        <div className={styles.videoWrapper}>
          <YouTube videoId="aLZQ-0dHbiU" opts={videoOptions} onReady={onVideo2Ready} />
          <div>Volume: {video2Volume}%</div>
          <div className={styles.controls}>
            <button onClick={() => setVideo2Volume(Math.min(video2Volume + 10, 100))}>+ Volume</button>
            <button onClick={() => {
              if (video2Playing) {
                video2Ref.pauseVideo();
              } else {
                video2Ref.playVideo();
              }
              setVideo2Playing(!video2Playing);
            }}>
              {video2Playing ? "Pause" : "Play"}
            </button>
            <button onClick={() => setVideo2Volume(Math.max(video2Volume - 10, 0))}>- Volume</button>
          </div>
        </div>
      </div>
    </main>
  );
  
}
