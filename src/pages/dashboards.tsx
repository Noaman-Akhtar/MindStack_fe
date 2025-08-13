import { useState } from 'react';
import '../App.css';
import { Button } from '../components/ui/Button';
import { PlusIcon } from '../components/ui/icons/plusIcon';
import { ShareIcon } from '../components/ui/icons/shareIcon';
import { Card } from '../components/ui/Card';
import { CreateContentModal } from '../components/ui/CreateContentModal';
import { Sidebar } from '../components/ui/Sidebar';

function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [extended, setExtended] = useState(true);

  return (
    <div className="min-h-screen bg-[#0F0F1A] flex">
      {/* Sidebar */}
      <Sidebar extended={extended} setExtended={setExtended} />

      {/* Main content */}
      <div
        className={`flex-1 px-4 transition-all duration-300 ${
          extended ? 'ml-72' : 'ml-0'
        }`}
      >
        <CreateContentModal open={modalOpen} onClose={() => setModalOpen(false)} />

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

        <div className="flex flex-wrap gap-4 px-2 py-3">
          <Card
            type="twitter"
            text="one of my tweets"
            link="https://x.com/Noaman__Akhtar/status/1951374528434893066"
          />
          <Card
            type="youtube"
            text="wtf pod"
            link="https://www.youtube.com/watch?v=O7O204wD82s"
          />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
