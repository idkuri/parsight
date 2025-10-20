import { FileText, Image, Music, Video, Archive, Code, File } from "lucide-react";

// central config object
const extensionMap = {
  // Documents
  pdf: { icon: FileText, color: "text-red-500", bgColor: "bg-red-500/10", borderColor: "border-red-500" },
  doc: { icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500" },
  docx: { icon: FileText, color: "text-blue-500", bgColor: "bg-blue-500/10", borderColor: "border-blue-500" },
  ppt: { icon: FileText, color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500" },
  pptx: { icon: FileText, color: "text-orange-500", bgColor: "bg-orange-500/10", borderColor: "border-orange-500" },
  xls: { icon: FileText, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500" },
  xlsx: { icon: FileText, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500" },
  csv: { icon: FileText, color: "text-green-500", bgColor: "bg-green-500/10", borderColor: "border-green-500" },

  // Images
  jpg: { icon: Image, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500" },
  jpeg: { icon: Image, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500" },
  png: { icon: Image, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500" },
  gif: { icon: Image, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500" },
  svg: { icon: Image, color: "text-purple-500", bgColor: "bg-purple-500/10", borderColor: "border-purple-500" },

  // Audio
  mp3: { icon: Music, color: "text-pink-500", bgColor: "bg-pink-500/10", borderColor: "border-pink-500" },
  wav: { icon: Music, color: "text-pink-500", bgColor: "bg-pink-500/10", borderColor: "border-pink-500" },
  flac: { icon: Music, color: "text-pink-500", bgColor: "bg-pink-500/10", borderColor: "border-pink-500" },

  // Videos
  mp4: { icon: Video, color: "text-indigo-500", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500" },
  avi: { icon: Video, color: "text-indigo-500", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500" },
  mov: { icon: Video, color: "text-indigo-500", bgColor: "bg-indigo-500/10", borderColor: "border-indigo-500" },

  // Archives
  zip: { icon: Archive, color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500" },
  rar: { icon: Archive, color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500" },
  "7z": { icon: Archive, color: "text-yellow-500", bgColor: "bg-yellow-500/10", borderColor: "border-yellow-500" },

  // Code
  js: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  jsx: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  ts: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  tsx: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  html: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  css: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  py: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
  java: { icon: Code, color: "text-cyan-500", bgColor: "bg-cyan-500/10", borderColor: "border-cyan-500" },
};

export const getFileIcon = (fileName = "") => {
  const extension = fileName.split(".").pop()?.toLowerCase() ?? "";
  return (
    extensionMap[extension] || {
      icon: File,
      color: "text-primary",
      bgColor: "bg-primary/10",
      borderColor: "border-primary"
    }
  );
};