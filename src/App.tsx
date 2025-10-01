import React, { useState } from 'react'
import Sidebar from './components/Sidebar'
import RequestEditor from './components/RequestEditor'
import ResponseViewer from './components/ResponseViewer'
import './components.css'

// Define interfaces for state (crucial for TypeScript)
interface RequestData {
  method: string;
  url: string;
  body: string;
}

interface ResponseData {
  status: number;
  statusText: string;
  body: any;
  time: number | null;
}

export default function App() {
  // 1. State for the user's current request
  const [request, setRequest] = useState<RequestData>({
    method: 'GET',
    url: 'https://jsonplaceholder.typicode.com/posts/1', // Default URL for easy testing
    body: '',
  });
  
  // 2. State for the API's response
  const [response, setResponse] = useState<ResponseData | null>(null);
  
  // 3. State to track if a request is currently in progress
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="app">
      <header>
        <h1>Postman Clone</h1>
        {/* Note: Added a simple indicator for the backend status for debugging */}
        <p style={{fontSize: '0.8rem', color: '#6366f1'}}>
            AI Backend Status: {isLoading ? 'Requesting...' : (response ? 'Ready' : 'Idle')}
        </p>
      </header>
      <main className="app-layout">
        <Sidebar />
        {/* CRITICAL CHANGE: Passing state and setters as props */}
        <RequestEditor
          request={request}
          setRequest={setRequest}
          setResponse={setResponse}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
        {/* Passing response state and loading status to the viewer */}
        <ResponseViewer
          response={response}
          isLoading={isLoading}
        />
      </main>
    </div>
  )
}
