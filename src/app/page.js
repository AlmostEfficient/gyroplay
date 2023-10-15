"use client"
import styles from './page.module.css'
import { useState, useEffect, useRef } from 'react';

export default function Home() {
  const [tiltValue, setTiltValue] = useState(0); // capturing the tilt along x-axis
  const [volumes, setVolumes] = useState({ audio1: 50, audio2: 50 });
  const [gradientColor, setGradientColor] = useState('#FF0000');

  const audio1Ref = useRef(null);
  const audio2Ref = useRef(null);

  const handleMotion = (event) => {
    const xTilt = event.accelerationIncludingGravity.y;
    setTiltValue(xTilt);
  };

  useEffect(() => {
    window.addEventListener('devicemotion', handleMotion);
    return () => {
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, []);

  useEffect(() => {
    const normalizedTilt = tiltValue / 10; // Assuming the tilt range is [-10, 10]
    let calculatedAudio1Volume = 0.5 + (normalizedTilt / 2);
    let calculatedAudio2Volume = 0.5 - (normalizedTilt / 2);
    calculatedAudio1Volume = Math.min(1, Math.max(0, calculatedAudio1Volume));
    calculatedAudio2Volume = Math.min(1, Math.max(0, calculatedAudio2Volume));
    if (audio1Ref.current) audio1Ref.current.volume = calculatedAudio1Volume;
    if (audio2Ref.current) audio2Ref.current.volume = calculatedAudio2Volume;


    setVolumes({
      audio1: Math.round(calculatedAudio1Volume * 100),
      audio2: Math.round(calculatedAudio2Volume * 100)
    })

    const color = computeGradientColor(tiltValue);
    setGradientColor(color);

  }, [tiltValue]);

  function handleVolumeChange() {
    setVolumes({
      audio1: audio1Ref.current ? Math.floor(audio1Ref.current.volume * 100) : 0,
      audio2: audio2Ref.current ? Math.floor(audio2Ref.current.volume * 100) : 0
    });
  }

  function computeGradientColor(tilt) {
    const normalizedValue = (tilt + 10) / 20; // Normalize the tilt value between 0 and 1
    
    const redComponent = Math.floor(255 * normalizedValue);
    const blueComponent = 255 - redComponent;
  
    return `rgb(${redComponent}, 0, ${blueComponent})`;
  }
  

  const [hasPermission, setHasPermission] = useState(false); // state to track motion access permissions

  function requestMotionAccess() {
    if (typeof DeviceMotionEvent.requestPermission === 'function') {
      DeviceMotionEvent.requestPermission()
        .then(permissionState => {
          if (permissionState === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
            setHasPermission(true); // set permission to true if granted
          }
        })
        .catch(console.error);
    } else {
      window.addEventListener('devicemotion', handleMotion);
      setHasPermission(true); // set permission to true for non-iOS 13+ devices
    }
  }

  return (
    <main className={styles.main} style={{ background: `linear-gradient(to bottom, ${gradientColor}, white)` }}>
      <div className={styles.header}>
        <h1 className={styles.title}>
            Welcome to Gyroplay!
        </h1>
        <div>
          <p>Phone tilt value (x-axis): {tiltValue ? tiltValue.toFixed(2) : 'N/A'}</p>
        </div>
      </div>

      {!hasPermission ? ( 
          <>
            <button className={styles.button} onClick={requestMotionAccess}>Request Motion Access</button>
          </>
        ) : (
          <div className={styles.videoContainer}>
            <div className={styles.videoWrapper}>
              <audio ref={audio1Ref} src="/bandstorm.mp3" controls onVolumeChange={handleVolumeChange} />
              <div>Volume: {volumes.audio1}%</div>

              <audio ref={audio2Ref} src="/music.mp3" controls onVolumeChange={handleVolumeChange} />
              <div>Volume: {volumes.audio2}%</div>
            </div>
          </div>
        )}
    </main>
  );
}
