'use client'
import { useEffect } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
export default function Index() {

  useEffect(() => {
    redirect('/protected');
  }, []);

  return (
    <h1>
      Please go to the protected path and Login to continue
    </h1>
  );
}
