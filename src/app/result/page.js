'use client';

import { useEffect, useState, useRef } from 'react';

const ResultsPage = () => {
  const [storyData, setStoryData] = useState(null);
  const audioRef = useRef(null); // 引用音频元素
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('storyData');
    if (storedData) {
      setStoryData(JSON.parse(storedData));
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      const audio = audioRef.current;
      const updateTime = () => setCurrentTime(audio.currentTime);
      const updateDuration = () => setDuration(audio.duration);

      audio.addEventListener('timeupdate', updateTime);
      audio.addEventListener('loadedmetadata', updateDuration);

      return () => {
        audio.removeEventListener('timeupdate', updateTime);
        audio.removeEventListener('loadedmetadata', updateDuration);
      };
    }
  }, [audioRef]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(error => {
          console.error("播放失败:", error);
        });
        setIsPlaying(true);
      } else {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!storyData) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center"
      style={{
        backgroundImage: "url('/images/result.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <button
        onClick={() => window.location.href = '/'} // 返回到首页
        className="absolute top-4 left-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        返回
      </button>
      <div className="p-6 rounded shadow-md flex flex-col items-center gap-4" style={{ width: '80%' }}>
        {/* 图片展示部分 */}
        <div className="w-3/4 flex justify-center mb-4">
          {storyData.image_url ? (
            <img
              src={storyData.image_url}
              alt="生成的故事图片"
              className="w-full rounded-md"
            />
          ) : (
            <img
              src="/images/default-image.png"
              alt="默认图片"
              className="w-full rounded-md"
            />
          )}
        </div>

        {/* 音频播放器部分 */}
        {storyData.audio_url ? (
          <div className="w-3/4 mb-4 flex flex-col items-center">
            <audio
              ref={audioRef}
              controls
              className="w-full"
              style={{ borderRadius: '8px' }}
            >
              <source src={storyData.audio_url} type="audio/mp3" />
              你的浏览器不支持音频播放。
            </audio>
          </div>
        ) : (
          <p>暂无音频</p>
        )}


        {/* 文字内容展示部分 */}
        <div className="text-orange-600 text-center w-3/4">
          <h1 className="text-3xl font-bold mb-6">{storyData.title || '生成的故事'}</h1>
          <p className="mb-4 text-lg leading-relaxed">
            <strong>故事内容:</strong> {storyData.story || '未提供故事内容'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;