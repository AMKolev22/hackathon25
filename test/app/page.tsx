"use client"
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
export default function Home() {
  const router = useRouter();
    useEffect(()=>{
      router.push("/authentication/sign");
    })
  return (
  <h1>nate hegros</h1>

  );
}
