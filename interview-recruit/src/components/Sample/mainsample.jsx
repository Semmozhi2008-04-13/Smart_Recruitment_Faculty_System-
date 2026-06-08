import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Exec from './Exec.jsx'
import { FireExtinguisherIcon } from 'lucide-react'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <FireExtinguisherIcon />
  </StrictMode>,
)
