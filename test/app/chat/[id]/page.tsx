"use client"

import { Calendar, Home, Inbox, Search, Settings } from "lucide-react"
import { signOut } from 'next-auth/react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { useSession } from 'next-auth/react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { useRouter } from 'next/navigation'
import { addUserClient } from "@/app/scripts/addUserClient";
import ChatInput from "./chat-box";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';


export default function Page({ params }: { params: Promise<{ id: string }> }) {
  
  const { data: session, status } = useSession();
  const [ chatId, setChatId ] = useState<String>("");
  const router = useRouter(); 
  const [user, setUser] = useState({
    username: session?.user?.name,
    chats: [],
    id: null,
    unfetched: true,
  })
  const [messages, setMessages] = useState<string[]>([]);
  
  const handleSendMessage = (message: string) => {
    const updateChat = async () => {
      try {
        const resUpdate = await fetch("http://localhost:3000/api/chat/update", {
          method: "POST",
          body: JSON.stringify({
            content: message,
            idString: chatId,
            role: "USER",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
  
        if (!resUpdate.ok) {
          console.error("Failed to send message, status code:", resUpdate.status);
          return;
        }

        const res = await fetch("http://localhost:5000/api/ai", {
          method: "POST",
          body: JSON.stringify({
            content: message,
            idString: chatId,
            role: "USER",
          }),
          headers: {
            "Content-type": "application/json; charset=UTF-8",
          },
        });
  
        if (!res.ok) {
          console.error("Failed to send message, status code:", res.status);
          return;
        }

       
        const data = await res.json();
        console.log("Message sent to Python backend:", data);
        location.reload();
      } catch (error) {
        console.error("Error sending message:", error);
      }
    };
  
    updateChat();
  
    setTimeout(() => {
      setUser((prevUser) => {
        const updatedChats = prevUser.chats.map((chat) => ({
          ...chat,
          messages: [
            ...chat.messages,
            {
              content: message,
              role: "USER",
            },
          ],
        }));
  
        return {
          ...prevUser,
          chats: updatedChats,
        };
      });
    }, 50);
  };
  
  

  const generateId = async () =>{
    const id = uuidv4();
    const res = await fetch("/api/chat/create", {
      method: "POST",
          body: JSON.stringify({
              name: "New chat",
              id: id,
              username: session?.user?.name
          }),
          headers: {
              "Content-type": "application/json; charset=UTF-8"
            }
    })
    if (res.ok){
      console.log("Created new chat!");
      const data = await res.json();
      setChatId(params.id);
      // user.chats.push(data);
    }
    router.push(`/chat/${id}`);
  } 


  useEffect(() => {
    if (session?.user?.name){
      fetch(`/api/user?username=${session?.user?.name}`)
      .then(res => {
        if (res.ok){
          res.json().then(obj => setUser(obj.user))
        } else{
          throw new Error(`Failed to fecth user info, error code: ${res.status}`);
        }
      })
    }
    setChatId(params.id);
  }, [session])

  if (status == "unauthenticated")
    router.push("/api/auth/signin");

  
  
  if (session?.user?.name != undefined && session?.user?.name != null){
    addUserClient(session?.user?.name);
    return (
      <div className="flex flex-row w-screen">
      <Sidebar className="flex flex-col">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Your new personal university advisor.</SidebarGroupLabel>
            <SidebarGroupContent className="mt-2">
              <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <a href={"#"} onClick={generateId}>
                        <Home />
                        <span>New chat</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroupLabel className="ml-2 mt-2">{session?.user?.name}'s chats: </SidebarGroupLabel>
          { user.chats.map((chat)=>(
            <h1 key={chat.id} onClick={()=>router.push(`/chat/${chat.idString}`)} className="cursor-pointer ml-4" >{chat.name}</h1>
          ))}
          <SidebarFooter className="fixed bottom-0">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuButton className="cursor-pointer">
                      <h1>{session?.user?.name}</h1>
                    </SidebarMenuButton>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    side="top"
                    className="w-[--radix-popper-anchor-width] ml-[5rem] -mb-3"
                  >
                    <DropdownMenuItem onClick={signOut}>
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </SidebarContent>
      </Sidebar>
      <div className="flex-1 ml-10 h-screen overflow-auto">
        {user.chats
          .filter((chat) => chat.idString === chatId)
          .map((chat) => (
            <div key={chat.idString} className="w-full flex flex-col gap-2 p-2 pr-12">
              {chat.messages.map((message, msgIndex) => (
                <div 
                  key={msgIndex} 
                  className={`max-w-[50%] w-fit break-words text-right
                    ${message.role === "USER" ? "self-end" : "self-start ml-12"}`}
                >
                  {message.role === "USER" && (
                    <>
                      <p className="font-bold text-sm">{session?.user?.name}</p>
                      <p className="text-sm">{message.content}</p>
                    </>
                  )}
                  {message.role === "ASSISTANT" && (
                    <>
                      <p className="text-sm text-left font-bold">{message.role}</p>
                      <p className="text-sm text-left">{message.content}</p>
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        <ChatInput onSendMessage={handleSendMessage} />
      </div>
    </div>
    )
  }
}
