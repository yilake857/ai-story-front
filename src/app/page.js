"use client";

import { useState } from "react";
import { useRouter } from 'next/navigation'

export default function Page() {
  const [storyDetails, setStoryDetails] = useState({
    storyContent: "",
    storyType: "",
    childAgeGroup: "",
    imageType: "",
    characterChoice: "",
  });


  const router = useRouter(); // 在客户端渲染时使用 useRouter

  const handleInputChange = (field, value) => {
    setStoryDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };
  
  const handleSubmit = async () => {
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
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to send story details: ${response.statusText}, Error: ${errorText}`);
      }

      const data = await response.json();
      // 你需要将 `pathname` 和 `query` 合并为一个完整的 URL
      // const data = {
      //   story: "这是一个神奇的冒险故事。",
      //   audio_url: "https://example.com/audio/story.mp3",
      //   image_url: "https://example.com/images/story-image.jpg",
      // };
      const targetUrl = `/result?story=${encodeURIComponent(data.story)}&audioUrl=${encodeURIComponent(data.audio_url)}&imageUrl=${encodeURIComponent(data.image_url)}`;
      router.push(targetUrl);
      
    } catch (error) {
      console.error(error);
      alert(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('/images/background.png')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        height: "100vh", // Ensure the entire page height is covered
        width: "100vw",  // Ensure the entire page width is covered
      }}
    >
      <div className="min-h-screen bg-gray-100 flex items-center justify-center w-full">
        <div className="bg-white p-10 shadow-lg rounded-lg max-w-md w-full">
          <header className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">故事生成系统</h1>
            <p className="text-sm text-gray-500 mt-2">Crafting Stories for Children Using AI</p>
          </header>
  
          <main>
            <table className="table-auto w-full text-left border-collapse border border-gray-300">
              <tbody>
                {/* Story Content */}
                <tr className="border-b border-gray-200">
                  <td className="p-4">
                    <label className="block text-gray-700 font-medium mb-1">Story Content</label>
                    <textarea
                      placeholder="Describe the story..."
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-300"
                      value={storyDetails.storyContent}
                      onChange={(e) => handleInputChange("storyContent", e.target.value)}
                    />
                  </td>
                </tr>
  
                {/* Audio Role */}
                <tr className="border-b border-gray-200">
                  <td className="p-4">
                    <label className="block text-gray-700 font-medium mb-1">Audio Role</label>
                    <select
                      value={storyDetails.characterChoice}
                      onChange={(e) => handleInputChange("characterChoice", e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select an audio role</option>
                      <option value="youxiaoxun">Youxiaoxun</option>
                      <option value="role2">Role 2</option>
                      <option value="role3">Role 3</option>
                    </select>
                  </td>
                </tr>
  
                {/* Story Type */}
                <tr className="border-b border-gray-200">
                  <td className="p-4">
                    <label className="block text-gray-700 font-medium mb-1">Story Type</label>
                    <select
                      value={storyDetails.storyType}
                      onChange={(e) => handleInputChange("storyType", e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select a story type</option>
                      <option value="冒险">冒险</option>
                      <option value="奇幻">奇幻</option>
                      <option value="悬疑">悬疑</option>
                    </select>
                  </td>
                </tr>
  
                {/* Image Type */}
                <tr className="border-b border-gray-200">
                  <td className="p-4">
                    <label className="block text-gray-700 font-medium mb-1">Image Type</label>
                    <select
                      value={storyDetails.imageType}
                      onChange={(e) => handleInputChange("imageType", e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select an image type</option>
                      <option value="卡通风格">卡通风格</option>
                      <option value="现实风格">现实风格</option>
                      <option value="抽象风格">抽象风格</option>
                    </select>
                  </td>
                </tr>
  
                {/* Age Group */}
                <tr className="border-b border-gray-200">
                  <td className="p-4">
                    <label className="block text-gray-700 font-medium mb-1">Age Group</label>
                    <select
                      value={storyDetails.childAgeGroup}
                      onChange={(e) => handleInputChange("childAgeGroup", e.target.value)}
                      className="border border-gray-300 rounded-md p-2 w-full focus:ring focus:ring-blue-300"
                    >
                      <option value="">Select an age group</option>
                      <option value="10-15岁">10-15岁</option>
                      <option value="15-20岁">15-20岁</option>
                      <option value="20岁以上">20岁以上</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
  
            <button
              onClick={handleSubmit}
              className="bg-blue-500 text-white mt-6 px-6 py-2 rounded-md w-full hover:bg-blue-600 transition duration-300"
            >
              Submit
            </button>
          </main>
        </div>
      </div>
    </div>
  );  
}
