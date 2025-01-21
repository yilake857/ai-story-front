"use client";

import { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'

export default function Page() {
  const [storyDetails, setStoryDetails] = useState({
    storyContent: "",
    storyType: "",
    childAgeGroup: "",
    imageType: "",
    characterChoice: "",
  });

  const [charCount, setCharCount] = useState(0);
  const [isOptionsVisible, setIsOptionsVisible] = useState(false);

  const router = useRouter(); // 在客户端渲染时使用 useRouter

  // 为每个 Dropdown 创建独立的 isOpen 状态
  const [isAudioRoleOpen, setIsAudioRoleOpen] = useState(false);
  const [isStoryTypeOpen, setIsStoryTypeOpen] = useState(false);
  const [isImageTypeOpen, setIsImageTypeOpen] = useState(false);
  const [isAgeGroupOpen, setIsAgeGroupOpen] = useState(false);
  const [isGenreOpen, setIsGenreOpen] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [abortController, setAbortController] = useState(null); // 新增状态

  const handleInputChange = (field, value) => {
    setStoryDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));

    if (field === "storyContent") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async () => {
    if (isLoading) {
      abortController.abort(); // 中断请求
      setIsLoading(false);
      return;
    }

    if (!storyDetails.storyContent.trim()) {
      setErrorMessage("内容不能为空");
      return;
    }

    setErrorMessage("");
    setIsLoading(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const response = await fetch("http://localhost:8010/story", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          story_content: storyDetails.storyContent,
          story_type: storyDetails.storyType,
          child_age_group: storyDetails.childAgeGroup,
          image_type: storyDetails.imageType,
          character_choice: storyDetails.characterChoice,
        }),
        credentials: 'include',
        signal: controller.signal, // 传递信号
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`服务器错误: ${errorText}`);
      }

      const data = await response.json();
      const targetUrl = `/result?story=${encodeURIComponent(data.story)}&audioUrl=${encodeURIComponent(data.audio_url)}&imageUrl=${encodeURIComponent(data.image_url)}`;
      router.push(targetUrl);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Request was aborted');
      } else {
        console.error(error);
        setErrorMessage(`服务器错误: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTextareaClick = () => {
    setIsOptionsVisible(true);
  };

  return (
    <div>
      <section>
        <div className="relative bg-cover bg-center h-screen flex items-center justify-center" style={{ backgroundImage: "url('/images/background.png')" }}>
          <div className="absolute left-1/2 transform -translate-x-1/2 text-center text-black" style={{ top: '15%' }}>
            <h1 className="md:text-6xl text-3xl mb-2 ZCOOLKuaiLe">AI创意故事生成器</h1>
            <h2 className="!font-alegreya t-shadow text-xl md:text-2xl text-zinc-800 whitespace-nowrap">Fostering Imaginations: Crafting Stories using AI</h2>
          </div>
        </div>

        <div className="absolute w-3/4 h-auto left-1/2 transform -translate-x-1/2 text-center text-black" style={{ top: '40%' }}>
          <section className="w-full h-full space-y-6 p-0 shadow-lg bg-white rounded-lg">
            {/* Story Content */}
            <div className="mt-2 bg-white rounded-lg p-6">
              <form className="flex flex-col md:flex-row justify-between gap-3 items-center" data-gtm-form-interact-id="0">
                <textarea
                  placeholder="Write me a story about..."
                  className="prompt-input"
                  value={storyDetails.storyContent}
                  onChange={(e) => handleInputChange("storyContent", e.target.value)}
                  onFocus={handleTextareaClick}
                  data-gtm-form-interact-field-id="0"
                />
                {storyDetails.storyContent && (
                  <div className="text-gray-700">
                    {charCount}/500
                  </div>
                )}
              </form>
            </div>

            <div className="max-h-max border-y overflow-y-scroll bg-white transition-all duration-500 ease-in-out ">
              {/* 选项始终可见 */}
              {isOptionsVisible && (
                <>
                  {/* Audio Role */}
                  <Dropdown
                    label="Audio Role"
                    isOpen={isAudioRoleOpen}
                    selectedOption={storyDetails.characterChoice}
                    toggleOpen={() => setIsAudioRoleOpen(!isAudioRoleOpen)}
                    options={["youxiaozhi", "youxiaoxun", "youxiaoqin"]}
                    onSelect={(option) => handleInputChange("characterChoice", option)}
                  />

                  {/* Story Type */}
                  <Dropdown
                    label="Story Type"
                    isOpen={isStoryTypeOpen}
                    selectedOption={storyDetails.storyType}
                    toggleOpen={() => setIsStoryTypeOpen(!isStoryTypeOpen)}
                    options={["冒险", "奇幻", "悬疑"]}
                    onSelect={(option) => handleInputChange("storyType", option)}
                  />

                  {/* Image Type */}
                  <Dropdown
                    label="Image Type"
                    isOpen={isImageTypeOpen}
                    selectedOption={storyDetails.imageType}
                    toggleOpen={() => setIsImageTypeOpen(!isImageTypeOpen)}
                    options={["卡通风格", "现实风格", "抽象风格"]}
                    onSelect={(option) => handleInputChange("imageType", option)}
                  />

                  {/* Age Group */}
                  <Dropdown
                    label="Age Group"
                    isOpen={isAgeGroupOpen}
                    selectedOption={storyDetails.childAgeGroup}
                    toggleOpen={() => setIsAgeGroupOpen(!isAgeGroupOpen)}
                    options={["10-15岁", "15-20岁", "20岁以上"]}
                    onSelect={(option) => handleInputChange("childAgeGroup", option)}
                  />
                </>
              )}
            </div>

            <div className="flex flex-col items-center justify-center h-auto">
              <button
                onClick={handleSubmit}
                className={`flex items-center justify-center px-6 py-2 bg-orange-600 text-white rounded-full shadow-lg ${isLoading ? 'opacity-50' : ''}`}
              >
                {isLoading ? (
                  <span className="loader"></span>
                ) : (
                  <>
                    <span className="mr-2">✨</span>
                    生成故事
                  </>
                )}
              </button>
              {errorMessage && <div className="text-red-500 mt-2">{errorMessage}</div>}
            </div>

          </section>
        </div>
      </section>
    </div>
  );
}

function Dropdown({ label, isOpen, selectedOption, toggleOpen, options, onSelect }) {
  // 默认选中第一个选项
  useEffect(() => {
    if (!selectedOption && options.length > 0) {
      onSelect(options[0]);
    }
  }, [options, selectedOption, onSelect]);

  return (
    <div>
      <div
        className={`flex items-center w-full px-4 py-3 border border-gray-200 cursor-pointer ${isOpen ? 'bg-gray-300' : 'bg-gray-200'}`}
        onClick={toggleOpen}
        style={{ fontFamily: 'Geist' }}
      >
        <span className={`font-bold text-lg ${isOpen ? 'text-orange-600' : ''}`}>{label}:</span>
        {selectedOption && (
          <span className="px-2 py-1 bg-orange-300 rounded-full ml-1 text-orange-600">
            {selectedOption}
          </span>
        )}
        <span className="ml-auto cursor-pointer">
          {isOpen ? '▼' : '▶'}
        </span>
      </div>
      {isOpen && (
        <div className="relative w-full bg-white border border-gray-200" style={{ fontFamily: 'YourFontName' }}>
          <div className="flex flex-wrap">
            {options.map(option => (
              <div
                key={option}
                onClick={() => onSelect(option)}
                className={`px-4 py-2 m-1 cursor-pointer ${selectedOption === option ? 'bg-orange-300 font-bold text-orange-600' : 'hover:bg-gray-100'
                  }`}
              >
                {option}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
