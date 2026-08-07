import React from "react";
import Image from "next/image";

type ImageFrameProps = {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  ratio?: "1/1" | "4/3" | "16/9";
  className?: string;
};

/**
 * Seed Image Frame — 비율 고정 이미지 프레임
 */
export default function ImageFrame({
  src,
  alt,
  width = 320,
  height = 240,
  ratio = "4/3",
  className = "",
}: ImageFrameProps) {
  const aspect =
    ratio === "1/1"
      ? "aspect-square"
      : ratio === "16/9"
        ? "aspect-video"
        : "aspect-[4/3]";

  return (
    <div
      className={`relative overflow-hidden rounded-md border border-line bg-surface ${aspect} ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
