'use client';

import { useSearchParams } from 'next/navigation'; // 引入 useSearchParams

const ResultsPage = () => {
  const searchParams = useSearchParams(); // 获取查询参数

  // 使用 get() 方法获取参数值
  const story = searchParams.get('story');
  const audioUrl = searchParams.get('audioUrl');
  const imageUrl = searchParams.get('imageUrl');

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/result.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="bg-white bg-opacity-80 p-6 rounded shadow-md max-w-lg w-full flex flex-col md:flex-row gap-4">
        {/* 图片展示部分 */}
        <div className="flex-shrink-0 w-full md:w-1/3 flex justify-center">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="生成的故事图片"
              className="w-3/4 max-w-xs rounded-md"
            />
          ) : (
            <p>未提供图片链接</p>
          )}
        </div>

        {/* 文字内容展示部分 */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-4">生成的故事</h1>
          <p className="mb-4">
            <strong>故事内容:</strong> {story || '未提供故事内容'}
          </p>
          {audioUrl ? (
            <audio controls className="w-full">
              <source src={audioUrl} type="audio/mp3" />
              你的浏览器不支持音频播放。
            </audio>
          ) : (
            <p>未提供音频链接</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;