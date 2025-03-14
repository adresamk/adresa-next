import { CSSProperties } from "react";

export default function CirclePin(props: any) {
  const defaultStyle = {};
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="8" cy="8" r="8" fill="#000000" />
    </svg>
  );
}
