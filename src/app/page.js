"use client"
import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });
  const [volumes, setVolumes] = useState({ audio1: 0, audio2: 0 });

  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);

  const handleOrientation = (event) => {
    const { alpha, beta, gamma } = event;
    setGyroData({ alpha, beta, gamma });
  };
  
  useEffect(() => {
    window.addEventListener('deviceorientation', handleOrientation);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  useEffect(() => {
    const normalizedBeta = gyroData.beta / 90;  // Normalize beta value to range [-1, 1]
    let calculatedAudio1Volume = 0.5 + (normalizedBeta / 2); // When beta is 0, volume is 0.5; when beta is 90, volume is 1
    let calculatedAudio2Volume = 0.5 - (normalizedBeta / 2); // When beta is 0, volume is 0.5; when beta is -90, volume is 1

    // Ensure volume is between 0 and 1
    calculatedAudio1Volume = Math.min(1, Math.max(0, calculatedAudio1Volume));
    calculatedAudio2Volume = Math.min(1, Math.max(0, calculatedAudio2Volume));

    if (audio1Ref.current) audio1Ref.current.volume = calculatedAudio1Volume;
    if (audio2Ref.current) audio2Ref.current.volume = calculatedAudio2Volume;

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
          <p>Phone X axis value: {gyroData.beta ? gyroData.beta.toFixed(2) : 'N/A'}</p>
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
