"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Timer() {
  const [time, setTime] = useState(15);
  const router = useRouter();
  useEffect(() => {
    if (time === 0) {
      router.push("/api/deleteid");
    } else {
      setTimeout(() => {
        setTime((prev) => prev - 1);
      }, 1000);
    }
  }, [router, time]);
  return <>{time}</>;
}
