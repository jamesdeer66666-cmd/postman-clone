import React from 'react'
import Sidebar from './components/Sidebar'
import RequestEditor from './components/RequestEditor'
import ResponseViewer from './components/ResponseViewer'
import './components.css'

export default function App() {
  return (
    <div className="app">
      <header>
        <h1>Postman Clone</h1>
      </header>
      <main className="app-layout">
        <Sidebar />
        <RequestEditor />
        <ResponseViewer />
      </main>
    </div>
  )
}
