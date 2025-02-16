import { useState, useEffect } from 'react';
import { FiArrowUpRight } from "react-icons/fi";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from 'axios';
import './App.css';
import { LuLoaderPinwheel } from "react-icons/lu";

function App() {
  const [code, setCode] = useState(`//Write your code here
    function sum() { return 1 + 1 }`);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState("system");

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
    } else if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [theme]);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    try {
      setLoading(true);
      setProgress(0); // Reset progress

      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev < 90) {
            return prev + 5;
          }
          return prev;
        });
      }, 200);

      console.log("Sending request to backend...");

      // Simulate progress updates (replace with actual API call)
      const response = await axios.post("http://localhost:3000/ai/get-review/", { code }, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent); // Update progress bar
        }
      });
      setReview(response.data);
    } catch (error) {
      console.error("Error reviewing code:", error);
    } finally {
      setLoading(false);
    }
  }


  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-400 to-gray-700 dark:bg-gray-100 flex flex-col items-center justify-between p-4">
      <header className="w-full flex justify-center items-center flex-col px-10">
        <nav className="flex flex-wrap md:text-center md:justify-between md:items-center w-full mb-10 pt-3 px-4 sm:px-6 lg:px-8">
          <a href="/" className="logo_text2 object-contain cyan_gradient uppercase text-lg sm:text-xl md:text-2xl justify-center cursor-pointer ">DeepReview</a>
          <div className="flex gap-2 flex-wrap justify-center sm:justify-end w-full sm:w-auto mt-2 sm:mt-0">
            <button type="button" onClick={() => window.open('https://www.linkedin.com/in/iamafridi/')} className="black_btn">LinkedIn</button>
            <button type="button" onClick={() => window.open('https://github.com/iamafridi/DeepReviewer')} className="black_btn">GitHub</button>
            <button type="button" onClick={() => window.open('https://iamafrididev.netlify.app')} className="black_btn">Contact</button>
          </div>
        </nav>

        <h1 className="head_text">
          Fix Your Code Effortlessly with <br className="max-md:hidden" />
          <span className="cyan_gradient">DeepReview AI</span>
        </h1>
        <h2 className="desc text-black">
          Your AI-Powered Debugging Assistant. Instantly analyze, detect, and fix errors in your code using DEEPSEEK's R1 Model cutting-edge technology. Debug smarter with DeepReview.
        </h2>
      </header>

      <div className="flex flex-row gap-6 w-full max-w-6xl">
        <div className="w-1/2 h-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-auto">
          {/* <input
            type="file"
            accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java"
            onChange={(e) => setCode(e.target.result)}
            className="mb-4 text-sm text-gray-400 cursor-pointer bg-gray-900 p-4 rounded-xl"
          /> */}
          <input
            type="file"
            accept=".js, .py, .css, .cpp, .cs, .ts, .html, .json, .java"
            onChange={(e) => {
              const file = e.target.files[0]; // Get the selected file
              if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                  setCode(reader.result); // Set the file content to the state
                };
                reader.readAsText(file); // Read the file as text
              }
            }}
            className="mb-4 text-sm text-gray-400 cursor-pointer bg-gray-900 p-4 rounded-xl"
          />

          <div className="border border-gray-600 rounded-lg p-4 roundxl bg-gray-900">
            <Editor value={code} onValueChange={(code) => setCode(code)}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={10}
              style={{ fontFamily: "Fire Code, monospace", fontsize: 16 }}></Editor>
          </div>

          <button onClick={reviewCode} className="w-full mt-4 py-3 text-lg font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-500 hover:to-blue-600  rounded-lg shadow-lg transform transition duration-300 hover:scale-105 hover:shadow-xl" disabled={loading}>
            {loading ? "Loading..." : "Review Code 🤖"}
          </button>
        </div>

        <div className="w-1/2 h-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin flex items-center justify-center">
                  <LuLoaderPinwheel className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 px-2">
                <div className="bg-blue-500 h-2 transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
              <p className='text-white'>{progress}%</p>
              <p className='font-bold text-white'>Giving Your Code a Reality Check... 👀</p>
            </div>
          ) : (
            <>
              {review === '' && (
                <p className="text-gray-400 uppercase bg-gray-900 border p-4 rounded-xl border-blue-500 ">Your review will appear here.</p>
              )}
              <Markdown rehypePlugins={[rehypeHighlight]} className="text-gray-300">{review}</Markdown>
            </>
          )}
        </div>


        {/* <div className="w-1/2 h-full bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 overflow-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full space-y-4 p-6">
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin flex items-center justify-center">
                  <LuLoaderPinwheel className="w-8 h-8 text-blue-500 animate-spin" />
                </div>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2 px-2">
                <div className="bg-blue-500 h-2 transition-all duration-200" style={{ width: `${progress}%` }}></div>
              </div>
              <p className='text-white'>{progress}%</p>
              <p className='font-bold text-white'>Giving Your Code a Reality Check... 👀</p>
            </div>
          ) : (
            <Markdown rehypePlugins={[rehypeHighlight]} className="text-gray-300">{review}</Markdown>
          )}
        </div> */}
      </div>

      <footer className="w-full  text-gray-400 text-center p-1 mt-6">
        <p>
          &copy; 2024 DeepReview. All rights reserved By
          <a className="underline ml-2 font-bold text-sm uppercase inline-flex items-center gap-1" href="https://iamafridi-portfolio.netlify.app" target="_blank" rel="noopener noreferrer">
            Afridi Akbar Ifty <FiArrowUpRight />
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;
