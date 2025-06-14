import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Lottie from "lottie-react";
import styles from "./ChatbotAssistant.module.scss";
import { trackEvent } from "../../../libs/gtagHelper";

import logo from "../../../public/static/assets/imgs/logo/logo.png";
import client from "../../../public/static/assets/imgs/logo/client.png";
import logo_chatbot from "../../../public/static/assets/imgs/Header/gooup1_logo.png";
import wave from "../../../public/static/assets/animations/wave.json";
import wave_voice from "../../../public/static/assets/animations/wave_voice.json";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPaperclip,
  faPaperPlane,
  faUpRightAndDownLeftFromCenter,
  faXmark,
  faMicrophone,
} from "@fortawesome/free-solid-svg-icons";
import { useStatusComponent } from "@/context/StatusComponent";

const ChatbotAssistant = () => {
  const [isShowChatbot, setIsShowChatbot] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef(null);
  const chatbotRef = useRef(null);
  const messagesRef = useRef(null);
  const [transcript, setTranscript] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [messageClient, setMessageClient] = useState("");
  const { statusChatbot, setStatusChatbot } = useStatusComponent();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "🤖 Xin chào! Tôi là GooUp1_Bot, sẵn sàng trò chuyện với bạn!",
    },
  ]);

  useEffect(() => {
    setIsShowChatbot(statusChatbot);
  }, [statusChatbot]);

  //Chỗ này format lại response của Gemini -> Markdown
  const parseMarkdown = (text) => {
    let parsed = text;
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    parsed = parsed.replace(/\*([^\n*]+)(?:\n|$)/g, "<li>- $1</li>");
    if (parsed.includes("<li>")) {
      parsed = `<ul>${parsed}</ul>`;
    }
    return parsed;
  };

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Chỗ này gọi qua file gemini.js ở pages/api - này được gọi là chỗ chứa endpoint
  const customApiCall = async (message) => {
    const updatedMessages = [...messages, { role: "user", content: message }];

    try {
      const response = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "API request failed");
      }

      const data = await response.json();
      return data.response;
    } catch (error) {
      console.error("Error calling API:", error);
      return `🤖 Có lỗi xảy ra: ${error.message}`;
    }
  };

  // Chỗ này là thêm response đã xử lý vào danh sách messages
  const handleBotResponse = (response) => {
    const parsedResponse = parseMarkdown(response);
    setMessages((prevMessages) => {
      const filteredMessages = prevMessages.filter(
        (msg) => msg.role !== "assistant" || msg.content !== "🤖 ● ● ●  "
      );
      return [
        ...filteredMessages,
        { role: "assistant", content: parsedResponse },
      ];
    });
    setIsProcessing(false);
  };

  // Chỗ này thì bắt sự kiện bàn phím
  const handleKeyDownMessage = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        textareaRef.current.value += "";
      } else {
        event.preventDefault();
        if (messageClient) {
          textareaRef.current.value = "";
          handleSendMessage();
        }
      }
    }
  };

  // Chỗ này thì hàm sự kiện thông thường
  const handleChangeMessage = (event) => {
    const message_client = event.target.value;
    setMessageClient(message_client);
  };

  // Chỗ này thì hàm sự kiện thông thường
  const handleSendMessage = async () => {
    textareaRef.current.value = "";
    if (messageClient.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "user", content: messageClient },
      ]);

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "assistant", content: "🤖 ● ● ●  " },
      ]);
      setIsProcessing(true);

      const botResponse = await customApiCall(messageClient);
      handleBotResponse(botResponse);
      trackEvent(
        process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
        "send_message",
        "Chatbot",
        "User sent a message",
        1
      );
      setMessageClient("");
      if (textareaRef.current) {
        textareaRef.current.value = "";
      }
    }
  };

  // Chỗ này thay đổi kích cỡ - theo chiều cao của textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      const adjustHeight = () => {
        textarea.style.height = "45";
        const minHeight = 45;
        const maxHeight = 100;
        const scrollHeight = textarea.scrollHeight;
        const newHeight = Math.max(
          minHeight,
          Math.min(scrollHeight, maxHeight)
        );
        textarea.style.height = `${newHeight}px`;
        console.log(
          "scrollHeight:",
          scrollHeight,
          "newHeight:",
          newHeight,
          "computedHeight:",
          textarea.offsetHeight
        );
      };

      textarea.style.height = "45px";
      adjustHeight();

      textarea.addEventListener("input", adjustHeight);

      return () => {
        textarea.removeEventListener("input", adjustHeight);
      };
    }
  }, [messageClient]);

  // Chỗ này tạo sự kiện tắt popup chatbot khi click ra ngoài màn hình
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatbotRef.current && !chatbotRef.current.contains(event.target)) {
        setIsShowChatbot(false);
        setIsExpanded(false);
        setStatusChatbot(false);
      }
    };

    if (isShowChatbot) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowChatbot, , setStatusChatbot]);

  // Chỗ này sự kiện mở chatbot
  const handleClickShowChatbot = () => {
    setIsShowChatbot(!isShowChatbot);
    setStatusChatbot(!isShowChatbot);
    console.log(isShowChatbot);
  };

  // Chỗ này sự kiện mở rộng khung chatbot
  const handleClickExpand = () => {
    setIsExpanded(!isExpanded);
    const chatbot = chatbotRef.current;
    const offset = 85;

    if (!isExpanded) {
      const expandedWidth = window.innerWidth - offset * 2;
      const expandedHeight = window.innerHeight - offset;
      chatbot.style.width = `${expandedWidth}px`;
      chatbot.style.height = `${expandedHeight}px`;
    } else {
      chatbot.style.width = "350px";
      chatbot.style.height = "550px";
    }
  };

  // Chỗ này thì hàm sự kiện thông thường
  const handleClickClose = () => {
    setIsShowChatbot(false);
    setStatusChatbot(false);
  };

  // Chỗ này thì mở micro để bắt đầu thu âm
  const handleClickMicro = () => {
    setIsRecording(true);
    if (!recognitionRef.current) {
      alert(
        "Trình duyệt của bạn không hỗ trợ Speech Recognition. Hãy sử dụng Chrome!"
      );
      return;
    }
    try {
      recognitionRef.current.start();
    } catch (error) {
      console.error("Lỗi khi bật micro:", error);
      alert("Không thể bật micro. Vui lòng kiểm tra quyền hoặc thử lại!");
      setIsRecording(false);
    }
  };

  // Chỗ này thì đóng micro
  const handleCloseMicro = () => {
    recognitionRef.current.stop();
    setIsRecording(false);
  };

  // Chỗ này thì sự kiện mở thu âm ở trình duyệt
  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "vi-VN";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event) => {
          const recordedTranscript = event.results[0][0].transcript;
          setTranscript(recordedTranscript);
          setIsRecording(false);
          if (recordedTranscript && textareaRef.current) {
            textareaRef.current.value = recordedTranscript;
            setMessageClient(recordedTranscript);
          }
        };

        recognitionRef.current.onerror = (event) => {
          console.error("Error:", event.error);
          setIsRecording(false);
        };

        recognitionRef.current.onend = () => {
          setIsRecording(false);
        };
      }
    }
  }, []);

  return (
    <div className={styles.chatbot_ui}>
      <div className={styles.chatbot_ui_container}>
        <div
          className={styles.icon_open_chatbot}
          onClick={handleClickShowChatbot}
        >
          <div className={styles.spiner}></div>
          <Image className={styles.logo_icon} src={logo} alt="logo GooUp1" />
        </div>

        {isShowChatbot && (
          <div className={styles.chatbot} ref={chatbotRef}>
            <div className={styles.chatbot_container}>
              <div className={styles.header_box}>
                <div className={styles.intro}>
                  <Image
                    className={styles.icon_header_box}
                    src={logo}
                    alt="GooUp1"
                  />
                  <span className={styles.name_assistant}>GooUp1 Bot</span>
                  {isRecording && (
                    <div
                      className={`${styles.animation} `}
                      onClick={handleCloseMicro}
                    >
                      <Lottie
                        animationData={wave_voice}
                        loop={true}
                        autoplay={true}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.float_func}>
                  <FontAwesomeIcon
                    className={styles.ico_zoom}
                    icon={faUpRightAndDownLeftFromCenter}
                    onClick={handleClickExpand}
                  />
                  <FontAwesomeIcon
                    className={`${styles.ico_close}`}
                    icon={faXmark}
                    onClick={handleClickClose}
                  />
                </div>
              </div>
              <hr />
              <div className={styles.chatbot_message_container}>
                <div className={styles.box_message} ref={messagesRef}>
                  {messages.map((item, index) =>
                    item?.role === "assistant" ? (
                      <div
                        key={index}
                        className={`${styles.message_box} ${styles.message_box_assistant}`}
                      >
                        <div className={styles.message_container}>
                          <Image
                            src={logo_chatbot}
                            alt="GooUp1"
                            className={`${styles.logo} ${styles.logo_assistant}`}
                          />
                          <div className={styles.message_content}>
                            <p
                              dangerouslySetInnerHTML={{
                                __html: item?.content,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        key={index}
                        className={`${styles.message_box} ${styles.message_box_client}`}
                      >
                        <div className={styles.message_container}>
                          <Image
                            src={client}
                            alt="GooUp1"
                            className={`${styles.logo} ${styles.logo_client}`}
                          />
                          <div className={styles.message_content}>
                            <p>{item?.content}</p>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div className={styles.footer_box}>
                <div className={styles.input_message_box}>
                  <textarea
                    ref={textareaRef}
                    placeholder="Chat ngay để nhận trợ giúp!"
                    type="text"
                    className={styles.input_message}
                    onChange={handleChangeMessage}
                    onKeyDown={handleKeyDownMessage}
                  />
                  <div className={styles.float_box_func}>
                    {/* <FontAwesomeIcon className={styles.ico_attached} icon={faPaperclip} /> */}
                    {isRecording ? (
                      <div
                        className={`${styles.animation} `}
                        onClick={handleCloseMicro}
                      >
                        <Lottie
                          animationData={wave}
                          loop={true}
                          autoplay={true}
                        />
                      </div>
                    ) : (
                      <FontAwesomeIcon
                        icon={faMicrophone}
                        className={styles.ico_micro}
                        onClick={handleClickMicro}
                      />
                    )}
                    <FontAwesomeIcon
                      icon={faPaperPlane}
                      className={styles.ico_send}
                      onClick={handleSendMessage}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatbotAssistant;
