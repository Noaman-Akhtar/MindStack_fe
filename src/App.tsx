import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Button } from './components/ui/Button'
import { PlusIcon } from './components/ui/icons/plusIcon'
import { ShareIcon } from './components/ui/icons/shareIcon'
import { Card } from './components/ui/Card'
import { CreateContentModal } from './components/ui/CreateContentModal'
function App() {
  const [modalOpen,setModalOpen] = useState(true);

  return (
    <>
    <CreateContentModal open={modalOpen} onClose={()=>{
      setModalOpen(false);
    }} />
    <div className='flex justify-end gap-4 py-1 mr-2'>
      <div onClick={()=>{setModalOpen(true)}}>
         <Button variant='primary' size="md" text="Add Content" startIcon={<PlusIcon size='md' />} />
      </div>
   
    <Button variant='secondary' size="md" text="share Brain" startIcon={<ShareIcon size='md'/>} /></div>
    <div className='flex gap-4 px-2' >
        <Card type='twitter' text='one of my tweets' link='https://x.com/Noaman__Akhtar/status/1951374528434893066'/>
    <Card type='youtube' text='wtf pod' link='https://www.youtube.com/watch?v=O7O204wD82s'/>
    </div>
  

    </>
  )
}

export default App
 