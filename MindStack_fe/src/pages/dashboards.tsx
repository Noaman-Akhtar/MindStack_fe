import { useEffect, useState } from "react";
import "../App.css";
import { Button } from "../components/ui/Button";
import { PlusIcon } from "../components/icons/plusIcon";
import { Card } from "../components/ui/Card";
import { Sidebar } from "../components/sidebar/Sidebar";
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Overlay } from "../components/ui/Overlay";
import { CreateContentModal } from "../components/modals/CreateContentModal";
import { ViewContentModal } from "../components/modals/viewModal";
import { SearchContentModel } from "../components/modals/SearchContentModel";


type Filter = "all" | "twitter" | "youtube" | "random";

type Content = {
  richNote: string | undefined;
  richNoteDelta: any;
  id?: string;
  _id?: string;
  title: string;
  link: string;
  type: "twitter" | "youtube";
  note?: string;
  score: number | undefined;
};

type DashboardNavProps = {
  scrolled: boolean;
  onAddContent: () => void;
  onSearch: () => void;
};

function DashboardNav({
  scrolled,
  onAddContent,
  onSearch,
}: DashboardNavProps) {
  return (
    <div
      className={`fixed top-0 right-0 left-0 z-20 flex items-center justify-end gap-2 py-2 pt-4 sm:gap-5 transition-all duration-300 bg-[#0F0F1A] px-4 ${
        scrolled ? "border-b border-gray-800" : "border-b border-transparent"
      }`}
    >
      <div className="flex justify-end sm:gap-5 gap-2">
         <input placeholder="Search" className="px-2 py-2 p-1 rounded-xl border-1 border-[#C4C2FF]  sm:text-base  text-[#C4C2FF] w-28 sm:w-56 focus:outline-none" onFocus={onSearch}>
         
         </input>
        <Button
          variant="primary"
          size="md"
          text="Add Content"
          startIcon={<PlusIcon size="md" />}
          onClick={onAddContent}
        />
       
      </div>
    </div>
  );
}

function Dashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [extended, setExtended] = useState(true);
  const [cards, setCards] = useState<Content[]>([]);
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [search, setSearch] = useState(false);
  const [searchMode, setSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Content[]>([]);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchCards = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: { Authorization: localStorage.getItem("token") ?? "" },
      });
      setCards(data?.content ?? []);
    } catch {
      setCards([]);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  const handleDelete = async (id: string) => {
    const prev = cards;
    setCards(prev.filter((c) => (c._id ?? c.link) !== id));
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
        headers: { Authorization: localStorage.getItem("token") ?? "" },
      });
    } catch (e) {
      setCards(prev);
      console.error(e);
      alert("Failed to delete. Try again.");
    }
  };

  const handleSearchComplete = (
    query: string,
    results: Array<{ _id: string; score?: number }>
  ) => {
    setSearchMode(true);
    setSearchQuery(query);
    const byId = new Map(cards.map((c) => [String(c._id), c]));

    // Preserve Pinecone order: walk results in order and pick matching cards
    const ranked = results
      .map((r) => {
        const card = byId.get(String(r._id));
        return card ? { ...card, score: r.score } : null;
      })
      .filter((c): c is Content => !!c);

    setSearchResults(ranked);
    setSearch(false);
  };

  const clearSearch = () => {
    setSearchMode(false);
    setSearchQuery("");
    setSearchResults([]);
  };

  const visibleCards = cards.filter((c) =>
    filter === "all" ? true : c.type === filter
  );
   const filteredSearchResults = searchMode
    ? searchResults.filter((c) => (filter === "all" ? true : c.type === filter))
    : [];
  const listToRender = searchMode ? filteredSearchResults : visibleCards;

  const viewingContent = cards.find((c) => c._id === viewingId) || null;
  return (
    <div className="min-h-screen bg-[#0F0F1A] ">
      <DashboardNav
        scrolled={scrolled}
        onAddContent={() => setModalOpen(true)}
        onSearch={() => setSearch(true)}
      />
      {/* Sidebar */}
    
        <Sidebar
          extended={extended}
          setExtended={setExtended}
          onSelectType={(f: Filter) => setFilter(f)}
          active={filter}
        />
    

      {/* Main content  */}
      <div
        className={`flex-1 px-4 justify-center  transition-all duration-300 pt-15 ${
          extended ? "sm:ml-70" : "sm:ml-8"
        }`}
      >
        <Overlay
          open={search}
          onClose={() => setSearch(false)}
          Modal={
            <SearchContentModel
              onClose={() => setSearch(false)}
              open={search}
              onViewAll={handleSearchComplete}
            />
          }
        />

        <Overlay
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          onContentAdded={fetchCards}
          Modal={
            <CreateContentModal
              onClose={() => setModalOpen(false)}
              onContentAdded={fetchCards}
            />
          }
        />
        <Overlay
          open={!!viewingContent}
          onClose={() => setViewingId(null)}
          Modal={
            viewingContent ? (
              <ViewContentModal
                content={viewingContent}
                onClose={() => setViewingId(null)}
                onUpdated={(updated) => {
                  // Patch local state
                  setCards((prev) =>
                    prev.map((c) =>
                      c._id === updated._id ? { ...c, ...updated } : c
                    )
                  );
                }}
              />
            ) : undefined
          }
        />

        {/* Search Banner */}

        {searchMode && (
          <div className="my-2 text-lg text-gray-100 ">
            Showing results for: “{searchQuery}”
            <button
              onClick={clearSearch}
              className="ml-2 underline text-lg font-bold cursor-pointer text-gray-100"
            >
              Clear
            </button>
          </div>
        )}
        {/* cards */}
        <div  className={`grid grid-cols-1 md:grid-cols-2 gap-10 justify-items-center py-2 ${
            extended
              ? "lg:grid-cols-2 xl:grid-cols-3"
              : "lg:grid-cols-3 xl:grid-cols-4"
          }`}
        >
          {listToRender.map((card) => (
            <Card
              key={card._id}
              _id={card._id}
              type={card.type}
              text={card.title}
              link={card.link}
              note={card.note}
              richNote={card.richNote}
              richNoteDelta={card.richNoteDelta}
              onDelete={handleDelete}
              onView={setViewingId}
              searchScore={searchMode ? (card as any).score : undefined}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
