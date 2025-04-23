import { useState } from "react";
import { SendHorizonal, Bot, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GeminiChatBox = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setLoading(true);
    setResponse("");

    try {
      const genAI = new GoogleGenerativeAI(
        "AIzaSyA7riYR9wlT5LaSG3C6MU1L1eXeHQWtkcs"
      );
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
      const result = await model.generateContent(input);
      const text = result.response.text();
      setResponse(text);
    } catch (err) {
      console.error(err);
      setResponse("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="  z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg flex items-center gap-2"
      >
        <Bot className="h-5 w-5" />
        <span className="hidden md:inline">Chat with Haven AI</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <div className="bg-[#1b1c24] w-full max-w-2xl rounded-xl p-6 relative text-white">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 right-3 text-neutral-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bot className="text-purple-500" />
              Haven AI
            </h2>

            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything..."
              rows={4}
              className="w-full p-3 rounded-md bg-[#2f303b] text-white resize-none outline-none"
            />

            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={sendMessage}
                disabled={loading}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2"
              >
                <SendHorizonal className="h-4 w-4 mr-1" />
                Send
              </Button>
              {loading && (
                <span className="text-sm text-neutral-400">Thinking...</span>
              )}
            </div>

            {response && (
              <div className="mt-4 p-3 bg-[#2f303b] rounded-md text-neutral-300 max-h-64 overflow-y-auto">
                {response}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default GeminiChatBox;
