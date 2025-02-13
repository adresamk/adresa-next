"use client";

import dynamic from "next/dynamic";
const UserComponents = dynamic(() => import("./UserComponents"), {
  ssr: false,
});

export default function UserComponentsClient() {
  return <UserComponents />;
}
