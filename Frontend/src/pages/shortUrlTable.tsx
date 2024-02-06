import axiosInstance from '@/common/axios';
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

interface ShortUrl {
  id: number;
  originalUrl: string;
  shortAlias: string;
  expiryDate: string;
}

const formatDate = (date: string) => {
  const day = new Date(date).toLocaleDateString()
  const time = new Date(date).toLocaleTimeString()
  return `${day} ${time}`
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'https://url-shorten-app-a15219219fbc.herokuapp.com'

const ShortUrlTable: React.FC = () => {
  const [shortUrls, setShortUrls] = useState<ShortUrl[]>([]);
  const fetchUrls = async () => {
    const res = await axiosInstance.get('/short-urls')
    if (res.data.length > 0)
      setShortUrls(res.data)

  }

  // const getRemainingTime = (expiryDate: string) => {
  //   const currentTime = new Date()
  //   const 
  // }   

  useEffect(() => {
    fetchUrls()
  }, []);

  return (
    <div className="container mx-auto p-4">
      <Link href="/" className="inline-flex items-center text-blue-500 hover:text-blue-700">
        <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
        <span>Back</span>
      </Link>
      <table className="table-auto border-collapse border border-gray-400 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300">Original URL</th>
            <th className="border border-gray-300">Shortened URL</th>
            <th className="border border-gray-300">Expiry Time (in minutes)</th>
          </tr>
        </thead>
        <tbody>
          {shortUrls.map((url) => (
            <tr key={url.id}>
              <td className="border border-gray-300 p-2">{url.originalUrl}</td>
              <td className="border border-gray-300 p-2">
                <a href={`${API_URL}/short-urls/r/${url.shortAlias}`} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                  {`${API_URL}/short-urls/r/${url.shortAlias}`}
                </a>
              </td>
              <td className="border border-gray-300 p-2">{formatDate(url.expiryDate)}</td>
              {/* <td className="border border-gray-300 p-2">{getRemainingTime(url.expiryDate)}</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShortUrlTable
