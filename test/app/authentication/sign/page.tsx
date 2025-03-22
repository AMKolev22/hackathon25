"use client"

import Image from "next/image";

import googlelogo from "../../../public/google-logo.svg"
import githublogo from "../../../public/github-logo.svg"


import { Card,Typography } from "@material-tailwind/react";
import React from "react";

import { signIn } from "next-auth/react";



export default function Sign() {
  console.log(process.cwd());
    const gitSign = async (): Promise<any> => {
      await signIn("github", {redirect: false, callbackUrl: '/chat/user-chats', timeout: 5000});
    }
    const googleSign = async (): Promise<any> => {
      await signIn("google", {redirect: false, callbackUrl: '/chat/user-chats'});
    }
    

    return (
        <div className = "w-screen h-screen overflow-hidden __sign" style={{backgroundColor: "#0A0A0A", fontFamily: "Inter, sans-serif"}}>
            <hr className="mt-16 opacity-50" style={{color: "#888"}} />
             <Card color="transparent" shadow={false} className="flex items-center __signPane" placeholder={undefined}>
              <Typography variant="h4" className="text-[#efefef] text-[4.5rem] mb-[5rem] mt-[16rem] tracking-wide" placeholder={undefined}>
                Sign in your profile
              </Typography>
              <button className=" bg-[#efefef] text-[3rem] flex items-center flex-row py-2 text-font-color rounded-2xl  __btn-google transition-all duration-300 hover:-translate-y-2 hover:bg-[#e1e1e1]" onClick={googleSign}>
                <span className="py-[0.8rem] pl-[5rem]"><Image src={googlelogo} width={25} height={25} alt={""} /></span>
                <span className="ml-[0.8rem] text-[1.8rem] font-medium pr-[5rem] antialiased tracking-wider">Continue with Google</span>
              </button>
              <button className=" text-[3rem] flex items-center flex-row py-2 text-font-color rounded-2xl __btn-google mt-6  border-dark-secondary hover:-translate-y-2 bg-[#24292E] transition-all duration-300 hover:bg-[#555]" onClick={gitSign}>
                <span className="py-[0.8rem] pl-[5rem]"><Image src={githublogo} width={25} height={25} alt={""} /></span>
                <span className="ml-[0.8rem] text-[1.8rem] font-medium pr-[5rem] antialiased tracking-wider text-[#efefef]">Continue with GitHub</span>
              </button>
          </Card>
        </div>
    );
}