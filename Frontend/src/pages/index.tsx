import ConfettiComponent from '@/common/ConfettiComponent';
import axiosInstance from '@/common/axios';
import Link from 'next/link';
import { useState, KeyboardEvent, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';

const ShortenPage: React.FC = () => {
  const [url, setUrl] = useState<string>('');
  const [showConfetti, setShowConfetti] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const validateUrl = (): boolean => {
    // Regular expression for URL validation
    const pattern = new RegExp('^(https?:\\/\\/)' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(url);
  };

  const handleSubmit = () => {
    const isValidUrl = validateUrl()
    if (!isValidUrl) return toast.error('Invalid Url')
    const body = {
      originalUrl: url
    }
    toast.promise(
      axiosInstance.post('/short-urls', body),
      {
        loading: 'Generating...',
        success: () => {
          console.log('lol');

          setShowConfetti(true);
          return <b>Success</b>
        },
        error: (err) => `Oops: ${err.message}`,
      }
    ).then(() => {
      setUrl('')
      setTimeout(() => setShowConfetti(false), 1000);
    })
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <div className="mt-4 flex">
        <Link href="/shortUrlTable" passHref className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-xs sm:text-sm sm:max-w-xs mx-auto block">
          View Shortened URLs
        </Link>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter URL"
          autoFocus
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={handleKeyPress}
          className="w-full p-2 border border-gray-300 rounded-md text-black sm:max-w-md mx-auto"
        />
        <button
          onClick={handleSubmit}
          className="w-full hover:bg-blue-700 mt-4 bg-blue-500 text-white p-2 rounded-md sm:max-w-md mx-auto block"
        >
          Shorten URL
        </button>
      </div>
      <ConfettiComponent show={showConfetti} />
    </div>
  );
}

export default ShortenPage;
