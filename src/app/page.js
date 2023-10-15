"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { useState, useEffect } from 'react';

export default function Home() {
  const [gyroData, setGyroData] = useState({ alpha: 0, beta: 0, gamma: 0 });

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
  

  return (
    <main className={styles.main}>
      <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Gyroplay!</a>
      </h1>

      <div className={styles.description}>
      <h1>Gyroscope Data</h1>

        <div>
          <p><strong>Alpha:</strong> {gyroData.alpha}</p>
          <p><strong>Beta:</strong> {gyroData.beta}</p>
          <p><strong>Gamma:</strong> {gyroData.gamma}</p>
        </div>
      </div>

      <div >
      <button onClick={requestGyroAccess}>Request Gyroscope Access</button>
      </div>

    </main>
  )
}
