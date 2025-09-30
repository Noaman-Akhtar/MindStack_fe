import { useEffect, useState } from 'react';
import '../App.css';
import { Button } from '../components/ui/Button';
import { PlusIcon } from '../components/icons/plusIcon';
import { ShareIcon } from '../components/icons/shareIcon';
import { Card } from '../components/ui/Card';
import { Sidebar } from '../components/sidebar/Sidebar';
import { BACKEND_URL } from "../config";
import axios from "axios";
import { Overlay } from '../components/ui/Overlay';
import { CreateContentModal } from '../components/modals/CreateContentModal';
import { ViewContentModal } from '../components/modals/viewModal';

type Filter = 'all' | 'twitter' | 'youtube'|'random';

type Content = {
  richNote: string | undefined;
  richNoteDelta: any;
  id?: string;
  _id?: string;
  title: string;
  link: string;
  type: 'twitter' | 'youtube';
  note?: string;
};

function Dashboard() {
  const [filter, setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [extended, setExtended] = useState(true);
  const [cards, setCards] = useState<Content[]>([]);
  const [viewingId, setViewingId] = useState<string | null>(null); 

  const fetchCards = async () => {
    try {
      const { data } = await axios.get(`${BACKEND_URL}/api/v1/content`, {
        headers: { Authorization: localStorage.getItem("token") ?? "" }
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
    setCards(prev.filter(c => (c._id ?? c.link) !== id));
    try {
      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`, {
        headers: { Authorization: localStorage.getItem('token') ?? '' }
      })
    }
    catch (e) {
      setCards(prev);
      console.error(e);
      alert('Failed to delete. Try again.');
    }
  }

  const visibleCards = cards.filter(c => filter === 'all' ? true : c.type === filter);

const viewingContent = cards.find(c => c._id === viewingId) || null;
  return (
    <div className="min-h-screen bg-[#0F0F1A] ">
      {/* Sidebar */}
      <Sidebar
        extended={extended}
        setExtended={setExtended}
        onSelectType={(f: Filter) => setFilter(f)}
        active={filter}
      />

       {/* Main content  */}
      <div
        className={`flex-1 px-4 transition-all duration-300 ${extended ? 'ml-72' : 'ml-3'
          }`}
      >
        <Overlay
          open={modalOpen} 
          onClose={() => setModalOpen(false)} 
          onContentAdded={fetchCards} 
          Modal={<CreateContentModal onClose={() => setModalOpen(false)} onContentAdded={fetchCards} />} 
        />  
        <Overlay
            open={!!viewingContent}
            onClose={() => setViewingId(null)}
            Modal={
            viewingContent ? (
      // content={viewingContent}
      //   onClose={() => setViewingId(null)}
      //   onUpdated={(updated) => {
      //     // Patch local state
      //       setCards(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));
      //   }}
      
      <ViewContentModal 
      content={viewingContent}
      onClose={() => setViewingId(null)}
      onUpdated={(updated) => {
        // Patch local state
          setCards(prev => prev.map(c => c._id === updated._id ? { ...c, ...updated } : c));
      }}
      />
    ) : undefined
  }
/>
        
        <div className="flex justify-end gap-5 py-2 pt-4 mr-2">
          <Button
            variant="primary"
            size="md"
            text="Add Content"
            startIcon={<PlusIcon size="md" />}
            onClick={() => setModalOpen(true)}
          />
          <Button
            variant="secondary"
            size="md"
            text="Share Brain"
            startIcon={<ShareIcon size="md" />}
          />
        </div>

        <div className={`flex flex-wrap items-start gap-6 px-2 py-3 ${extended ? "ml-7" : "ml-0"}`}>
          {visibleCards.map(card => (
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
/>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
