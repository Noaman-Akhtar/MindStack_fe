import React, { useEffect } from "react";
import { Button } from "../ui/Button";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";

interface SearchContentModelProps {
  open: boolean;
  onClose: () => void;
  onViewAll?: (query: string, results: any[]) => void;
}

export function SearchContentModel({
  open,
  onClose,
  onViewAll,
}: SearchContentModelProps) {
  const queryRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    if(isExpanded){
      queryRef.current?.focus();
    }
  }, [isExpanded]);

  useEffect(() => {
    if (open) {
      setIsExpanded(true)
    } else {
      setIsExpanded(false);
    }}, [open]);

  const handleSearch = async () => {
    const query = queryRef.current?.value.trim() ?? "";
    if (!query) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/api/v1/search`,
        { query },
        {
          headers: {
            Authorization: localStorage.getItem("token"),
          },
        }
      );

      const results = response.data.results || [];

      onViewAll?.(query, results);
      onClose();
    } catch (error) {
      console.error("Search Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSearch();
    }
  };

  if (!open) return null;

  return (
      <div
      className="fixed inset-0 bg-black/40 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-[#0F0F1A] rounded-lg p-4 sm:w-[200px] md:w-[400px] lg:w-[500px] mx-auto mt-  transition-all duration-300 ease-in-out ${
          isExpanded ? "  opacity-100" : "max-h-0 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <textarea
          ref={queryRef}
          placeholder="Search for anything... (e.g., 'react hooks tutorial')"
          className="w-full p-2 rounded-md text-md placeholder:italic placeholder-[#d5d4eb] outline-none border-[1.5px] bg-[#0F0F1A] text-[#d5d4eb] border-gray-400 focus:border-gray-600/60"
          rows={3}
          onKeyDown={handleKeyDown}
        />

        <div className="flex gap-2 mt-4">
          <Button
            variant="primary"
            size="md"
            text={loading ? "Searching..." : "Search"}
            onClick={handleSearch}
            disabled={loading}
          />
          <Button
            variant="secondary"
            size="md"
            text="Close"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}
