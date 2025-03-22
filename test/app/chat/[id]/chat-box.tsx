"use client"
import { Input, } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { FilePlus2 } from 'lucide-react';


export default function ChatInput({ onSendMessage }: { 
  onSendMessage: (message: string, files?: File[]) => void 
}) {
  const [message, setMessage] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim() !== "" || files.length > 0) {
      onSendMessage(message, files);
      setMessage("");
      setFiles([]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleFileIconClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  return (
    <div className="fixed inset-0 flex items-end justify-center">
      <div className="p-3 bg-white border-t border-gray-300 border-none mb-4 inline-block w-fit scale-[120%]">
        <div className="flex flex-col p-2 rounded-lg shadow-sm w-md">
          {files.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 shadow-sm w-fit">
              {files.map((file, index) => (
                <div key={index} className="flex items-center border-solid border-bg-black px-2 py-1 rounded text-xs">
                  <span className="truncate max-w-[350px]">{file.name}</span>
                  <button 
                    className="ml-2 text-gray-500 hover:text-gray-700"
                    onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-start">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 resize-none border-none bg-transparent outline-none px-2 text-sm leading-5 max-h-[300px] overflow-y-auto rounded-md"
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
            
            <span 
              className="pb-1 text-sm self-end cursor-pointer hover:text-blue-500"
              onClick={handleFileIconClick}
            >
              <FilePlus2 />
            </span>
            
            <Button onClick={handleSend} className="ml-2 px-3 py-1 text-sm self-end cursor-pointer">
              Send
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
