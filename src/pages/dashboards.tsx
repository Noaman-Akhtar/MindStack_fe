import { useEffect, useState } from 'react';
import '../App.css';
import { Button } from '../components/ui/Button';
import { PlusIcon } from '../components/ui/icons/plusIcon';
import { ShareIcon } from '../components/ui/icons/shareIcon';
import { Card } from '../components/ui/Card';
import { CreateContentModal } from '../components/ui/CreateContentModal';
import { Sidebar } from '../components/ui/Sidebar';
import { BACKEND_URL } from "../config";
import axios from "axios";

type Filter =
  'all'|'twitter'|'youtube';


type Content = {
  id?: string;
  _id?: string;
  title: string;
  link: string;
  type: 'twitter' | 'youtube';
};

function Dashboard() {
  const [filter,setFilter] = useState<Filter>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [extended, setExtended] = useState(true);
  const [cards,setCards] = useState<Content[]>([]);

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

  const handleDelete = async (id:string)=>{
    const prev = cards;
    setCards(prev.filter(c=>(c._id??c.link)!==id));
    try{
      await axios.delete(`${BACKEND_URL}/api/v1/content/${id}`,{
        headers:{Authorization:localStorage.getItem('token')??''}
      })
    }
    catch(e){
      setCards(prev);
      console.error(e);
      alert('Failed to delete. Try again.');
    }
  }
const visibleCards = cards.filter(c=>filter === 'all' ? true : c.type === filter);


  return (
    <div className="min-h-screen bg-[#0F0F1A] flex">
      {/* Sidebar */}
      <Sidebar extended={extended} setExtended={setExtended}    onSelectType={(f: Filter) => setFilter(f)} active={filter} />

      {/* Main content */}
      <div
        className={`flex-1 px-4 transition-all duration-300 ${
          extended ? 'ml-72' : 'ml-0'
        }`}
      >
        <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} onContentAdded={fetchCards}/>

        <div className="flex justify-end gap-4 py-1 mr-2">
          <div onClick={() => setModalOpen(true)}>
            <Button
              variant="primary"
              size="md"
              text="Add Content"
              startIcon={<PlusIcon size="md" />}
            />
          </div>
          <Button
            variant="secondary"
            size="md"
            text="Share Brain"
            startIcon={<ShareIcon size="md" />}
          />
        </div>

        <div className="flex flex-wrap items-start gap-4 px-2 py-3 ">
    
  
         {visibleCards.map(card =>(
          // @ts-ignore: 'card' is inferred as never; temporary until state is typed
          <Card key={card.id??card._id??card.link}
        
            _id={card._id}
            
            type={card.type}
            
            text={card.title} 
          
            link={card.link}
            onDelete={handleDelete}
          />
         ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
