
"use client";

export default function Spinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center  z-50">
      <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
    </div>
  );
}
