"use client"
import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [volumes, setVolumes] = useState({ audio1: 0, audio2: 0 });

  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);

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

  useEffect(() => {
    const absoluteBeta = Math.abs(gyroData.beta);  // Consider absolute value
    const normalizedBeta = absoluteBeta / 90;
    let calculatedAudio1Volume = Math.floor(100 * normalizedBeta);
    let calculatedAudio2Volume = Math.floor(100 * (1 - normalizedBeta));

    // Ensure volume is between 0 and 100
    calculatedAudio1Volume = Math.min(100, Math.max(0, calculatedAudio1Volume));
    calculatedAudio2Volume = Math.min(100, Math.max(0, calculatedAudio2Volume));

    if (audio1Ref.current) audio1Ref.current.volume = calculatedAudio1Volume / 100;
    if (audio2Ref.current) audio2Ref.current.volume = calculatedAudio2Volume / 100;
    
    handleVolumeChange();

  }, [gyroData]);


  function handleVolumeChange() {
    setVolumes({
      audio1: audio1Ref.current ? Math.floor(audio1Ref.current.volume * 100) : 0,
      audio2: audio2Ref.current ? Math.floor(audio2Ref.current.volume * 100) : 0
    });
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
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>
            Welcome to Gyroplay!
        </h1>
        <div>
          <p>Phone X axis value: {gyroData.beta}</p>
        </div>
        <button className={styles.button} onClick={requestGyroAccess}>Request Gyroscope Access</button>
      </div>
  
      <div className={styles.videoContainer}>
        <div className={styles.videoWrapper}>
          <audio 
            ref={audio1Ref} 
            src="/bandstorm.mp3" 
            controls 
            onVolumeChange={handleVolumeChange}
          />
          <div>Volume: {volumes.audio1}%</div>

          <audio 
            ref={audio2Ref} 
            src="/music.mp3" 
            controls 
            onVolumeChange={handleVolumeChange}
          />
          <div>Volume: {volumes.audio2}%</div>
        </div>
      </div>
    </main>
  );
}
