import { useAppStore } from "../../../../../../store";
import moment from "moment";
import { useEffect, useState, useRef } from "react";
import { apiClient } from "../../../../../../lib/api-client";
import {
  FETCH_ALL_MESSAGES_ROUTE,
  HOST,
  GET_CHANNEL_MESSAGES,
  MESSAGE_TYPES,
} from "../../../../../../utils/constants";
import { IoMdArrowRoundDown } from "react-icons/io";
import { MdFolderZip } from "react-icons/md";
import { IoCloseSharp } from "react-icons/io5";
import { getColor } from "../../../../../../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const MessageContainer = () => {
  const [showImage, setShowImage] = useState(false);
  const [imageURL, setImageURL] = useState(null);
  const [showVideo, setShowVideo] = useState(false);
  const [videoURL, setVideoURL] = useState(null);

  const {
    selectedChatData,
    selectedChatType,
    userInfo,
    setSelectedChatMessages,
    selectedChatMessages,
    setIsDownloading,
    setDownloadProgress,
  } = useAppStore();

  const messageEndRef = useRef(null);

  useEffect(() => {
    const getMessages = async () => {
      const response = await apiClient.post(
        FETCH_ALL_MESSAGES_ROUTE,
        {
          id: selectedChatData._id,
        },
        { withCredentials: true }
      );

      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };

    const getChannelMessages = async () => {
      const response = await apiClient.get(
        `${GET_CHANNEL_MESSAGES}/${selectedChatData._id}`,
        { withCredentials: true }
      );
      if (response.data.messages) {
        setSelectedChatMessages(response.data.messages);
      }
    };

    if (selectedChatData._id) {
      if (selectedChatType === "contact") getMessages();
      else if (selectedChatType === "channel") getChannelMessages();
    }
  }, [selectedChatData, selectedChatType, setSelectedChatMessages]);

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedChatMessages]);

  const checkIfImage = (filePath) => {
    const imageRegex =
      /\.(jpg|jpeg|png|gif|bmp|tiff|tif|webp|svg|ico|heic|heif)$/i;
    return imageRegex.test(filePath);
  };

  const checkIfAudio = (filePath) => {
    const audioRegex = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;
    return audioRegex.test(filePath);
  };

  const checkIfVideo = (filePath) => {
    const videoRegex = /\.(mp4|mov|avi|mkv|webm|flv|wmv)$/i;
    return videoRegex.test(filePath);
  };

  const downloadFile = async (url) => {
    setIsDownloading(true);
    setDownloadProgress(0);
    const response = await apiClient.get(`${HOST}/${url}`, {
      responseType: "blob",
      onDownloadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        const percentCompleted = Math.round((loaded * 100) / total);
        setDownloadProgress(percentCompleted);
      },
    });
    const urlBlob = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = urlBlob;
    link.setAttribute("download", url.split("/").pop());
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(urlBlob);
    setIsDownloading(false);
    setDownloadProgress(0);
  };

  const speakText = (text) => {
    if ("speechSynthesis" in window) {
      const synth = window.speechSynthesis;
      const utterance = new SpeechSynthesisUtterance(text);

      utterance.lang = "en-IN";
      utterance.rate = 0.8;
      const voices = synth.getVoices();
      let indianVoice =
        voices.find((voice) => voice.name.includes("Microsoft Heera")) ||
        voices.find((voice) => voice.lang === "en-IN") ||
        voices.find((voice) => voice.lang.startsWith("en"));

      if (indianVoice) {
        utterance.voice = indianVoice;
      }

      synth.speak(utterance);
    } else {
      alert("Your browser doesn't support text-to-speech.");
    }
  };

  const renderDMMessages = (message) => {
    return (
      <div
        className={`message ${
          message.sender === selectedChatData._id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/5 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words`}
          >
            {message.content}{" "}
            <button
              onClick={() => speakText(message.content)}
              className="ml-1 p-1 text-sm bg-gray-700 text-white rounded-full hover:bg-gray-800"
            >
              🔊
            </button>
          </div>
        )}

        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
            className={`${
              message.sender !== selectedChatData._id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 lg:max-w-[50%] break-words`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  height={300}
                  width={300}
                />
              </div>
            ) : checkIfAudio(message.fileUrl) ? (
              <div className="flex items-center gap-4">
                <audio controls className="max-w-[250px]">
                  <source
                    src={`${HOST}/${message.fileUrl}`}
                    type={`audio/${message.fileUrl.split(".").pop()}`}
                  />
                  Your browser does not support the audio element.
                </audio>
               
              </div>
            ) : checkIfVideo(message.fileUrl) ? (
              <div className="flex flex-col gap-2">
                <video
                  controls
                  className="max-w-full rounded-lg cursor-pointer"
                  onClick={() => {
                    setShowVideo(true);
                    setVideoURL(message.fileUrl);
                  }}
                >
                  <source
                    src={`${HOST}/${message.fileUrl}`}
                    type={`video/${message.fileUrl.split(".").pop()}`}
                  />
                  Your browser does not support the video tag.
                </video>
                
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <button
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </button>
              </div>
            )}
          </div>
        )}

        <div className="text-xs text-gray-600">
          {moment(message.timestamp).format("LT")}
        </div>
      </div>
    );
  };

  const renderChannelMessages = (message) => {
    return (
      <div
        className={`mt-5 ${
          message.sender._id !== userInfo.id ? "text-left" : "text-right"
        }`}
      >
        {message.messageType === MESSAGE_TYPES.TEXT && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {message.content}
            <button
              onClick={() => speakText(message.content)}
              className="ml-1 p-1 text-sm bg-gray-700 text-white rounded-full hover:bg-gray-800"
            >
              🔊
            </button>
          </div>
        )}
        {message.messageType === MESSAGE_TYPES.FILE && (
          <div
            className={`${
              message.sender._id === userInfo.id
                ? "bg-[#8417ff]/5 text-[#8417ff]/90 border-[#8417ff]/50"
                : "bg-[#2a2b33]/50 text-white/80 border-[#ffffff]/20"
            } border inline-block p-4 rounded my-1 max-w-[50%] break-words ml-9`}
          >
            {checkIfImage(message.fileUrl) ? (
              <div
                className="cursor-pointer"
                onClick={() => {
                  setShowImage(true);
                  setImageURL(message.fileUrl);
                }}
              >
                <img
                  src={`${HOST}/${message.fileUrl}`}
                  alt=""
                  height={300}
                  width={300}
                />
              </div>
            ) : checkIfAudio(message.fileUrl) ? (
              <div className="flex items-center gap-4">
                <audio controls className="max-w-[250px]">
                  <source
                    src={`${HOST}/${message.fileUrl}`}
                    type={`audio/${message.fileUrl.split(".").pop()}`}
                  />
                  Your browser does not support the audio element.
                </audio>
                
              </div>
            ) : checkIfVideo(message.fileUrl) ? (
              <div className="flex flex-col gap-2">
                <video
                  controls
                  className="max-w-full rounded-lg cursor-pointer"
                  onClick={() => {
                    setShowVideo(true);
                    setVideoURL(message.fileUrl);
                  }}
                >
                  <source
                    src={`${HOST}/${message.fileUrl}`}
                    type={`video/${message.fileUrl.split(".").pop()}`}
                  />
                  Your browser does not support the video tag.
                </video>
                
              </div>
            ) : (
              <div className="flex items-center justify-center gap-5">
                <span className="text-white/80 text-3xl bg-black/20 rounded-full p-3">
                  <MdFolderZip />
                </span>
                <span>{message.fileUrl.split("/").pop()}</span>
                <button
                  className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
                  onClick={() => downloadFile(message.fileUrl)}
                >
                  <IoMdArrowRoundDown />
                </button>
              </div>
            )}
          </div>
        )}
        {message.sender._id !== userInfo.id ? (
          <div className="flex items-center justify-start gap-3">
            <Avatar className="h-8 w-8">
              {message.sender.image && (
                <AvatarImage
                  src={`${HOST}/${message.sender.image}`}
                  alt="profile"
                  className="rounded-full"
                />
              )}
              <AvatarFallback
                className={`uppercase h-8 w-8 flex ${getColor(
                  message.sender?.color || "default"
                )} items-center justify-center rounded-full`}
              >
                {message.sender?.firstName?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm text-white/60">{`${message.sender.firstName} ${message.sender.lastName}`}</span>

            <div className="text-xs text-white/60">
              {moment(message.timestamp).format("LT")}
            </div>
          </div>
        ) : (
          <div className="text-xs text-white/60 mt-1">
            {moment(message.timestamp).format("LT")}
          </div>
        )}
      </div>
    );
  };

  const renderMessages = () => {
    let lastDate = null;
    return selectedChatMessages.map((message, index) => {
      const messageDate = moment(message.timestamp).format("YYYY-MM-DD");
      const showDate = messageDate !== lastDate;
      lastDate = messageDate;
      return (
        <div key={index} className="">
          {showDate && (
            <div className="text-center text-xs text-gray-500 my-2">
              {moment(message.timestamp).format("LL")}
            </div>
          )}

          {selectedChatType === "contact" && renderDMMessages(message)}
          {selectedChatType === "channel" && renderChannelMessages(message)}
        </div>
      );
    });
  };

  return (
    <div
      className="flex-1 overflow-y-auto 
    scroll-hidden p-4 px-8 md:w-[65vw] lg:w-[70vw] xl:w-[80vw] w-full"
    >
      {renderMessages()}

      <div ref={messageEndRef} />

      {showImage && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div>
            <img
              src={`${HOST}/${imageURL}`}
              className="h-[80vh] w-full bg-cover"
              alt=""
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => downloadFile(imageURL)}
            >
              <IoMdArrowRoundDown />
            </button>
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowImage(false);
                setImageURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}

      {showVideo && (
        <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
          <div className="w-full max-w-4xl">
            <video
              controls
              autoPlay
              className="w-full max-h-[80vh] rounded-lg"
              src={`${HOST}/${videoURL}`}
            />
          </div>
          <div className="flex gap-5 fixed top-0 mt-5">
            
            <button
              className="bg-black/20 p-3 text-2xl rounded-full hover:bg-black/50 cursor-pointer transition-all duration-300"
              onClick={() => {
                setShowVideo(false);
                setVideoURL(null);
              }}
            >
              <IoCloseSharp />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageContainer;
