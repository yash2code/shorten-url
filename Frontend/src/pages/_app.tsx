import '@/styles/globals.css'
import { initParticlesEngine } from '@tsparticles/react';
import type { AppProps } from 'next/app'
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast'
import { loadFull } from 'tsparticles';
import { Engine } from '@tsparticles/engine';

export default function App({ Component, pageProps }: AppProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine: Engine) => {
      await loadFull(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);
  return (
    <>
      <Toaster
        position="bottom-center"
      />
      <Component {...pageProps} />
    </>
  )
}
