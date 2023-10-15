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

      </div>

    </main>
  )
}
