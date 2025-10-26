import React from "react";
import { Button } from "../ui/Button";
import { useRef, useState } from "react";
import { BACKEND_URL } from "../../config";
import axios from "axios";

interface SearchResult {
  _id: string;
  score: number;
}

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
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 w-[500px] max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Search Content</h2>
        <textarea
          ref={queryRef}
          placeholder="Search for anything... (e.g., 'react hooks tutorial')"
          className="w-full p-2 rounded-md text-md placeholder:italic outline-none border-[1.3px] bg-gray-100 border-gray-400 focus:border-purple-900/60"
          rows={3}
          onKeyDown={handleKeyDown}
        />

        <div className="flex gap-2 mb-4">
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
