import 'bootstrap/dist/css/bootstrap.min.css'
import './style/main.scss'

import Home from "./components/Home"
import { useAtom } from 'jotai'
import { currentUserAtom } from './utils/atom'

import { Modal } from 'react-bootstrap'

import Select from 'react-select'
import { Toaster } from 'react-hot-toast'

function App() {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom)

  const opts = [
    {
      value: "Jad",
      label: "Jad"
    },
    {
      value: "Khaled",
      label: "Khaled"
    }
  ]

  return (
    <div className='main'>
      <Toaster />
      <Modal show={!currentUser} size='lg' dialogClassName="dark-modal" centered>
        <Modal.Header>
          <h3>Who is using the site?</h3>
        </Modal.Header>
        <Modal.Body>
          <Select
            options={opts}
            onChange={(e) => setCurrentUser(e?.value)}
            menuPlacement="auto"
            styles={{
              control: (provided) => ({
                ...provided,
                backgroundColor: '#343a40',
                borderColor: '#454d55',
                color: 'white',
              }),
              menu: (provided) => ({
                ...provided,
                backgroundColor: '#343a40',
                color: 'white',
              }),
              singleValue: (provided) => ({
                ...provided,
                color: 'white',
              }),
              option: (provided, state) => ({
                ...provided,
                backgroundColor: state.isSelected ? '#007bff' : '#343a40',
                color: state.isSelected ? 'white' : 'white',
                '&:hover': {
                  backgroundColor: '#007bff',
                  color: 'white',
                },
              }),
              placeholder: (provided) => ({
                ...provided,
                color: '#6c757d',
              }),
              input: (provided) => ({
                ...provided,
                color: 'white',
              }),
            }}
          />
        </Modal.Body>
      </Modal>
      {currentUser && <Home />}
    </div>
  )
}

export default App
