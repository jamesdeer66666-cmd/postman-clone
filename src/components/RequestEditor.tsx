import React from 'react'

// Define props interface
interface RequestEditorProps {
  request: {
    method: string;
    url: string;
    body: string;
  };
  setRequest: React.Dispatch<React.SetStateAction<{
    method: string;
    url: string;
    body: string;
  }>>;
  setResponse: React.Dispatch<React.SetStateAction<{
    status: number;
    statusText: string;
    body: any;
    time: number | null;
  } | null>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function RequestEditor({
  request,
  setRequest,
  setResponse,
  isLoading,
  setIsLoading,
}: RequestEditorProps) {

  const handleSend = async () => {
    if (!request.url) return;
    setIsLoading(true);
    setResponse(null); // Clear previous response
    const startTime = Date.now();

    try {
      const options: RequestInit = {
        method: request.method,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      if (request.body && ['POST', 'PUT', 'PATCH'].includes(request.method)) {
        options.body = request.body;
      }

      const res = await fetch(request.url, options);
      const endTime = Date.now();
      const time = endTime - startTime;

      let responseBody;
      try {
        // Try to parse as JSON, otherwise treat as text
        responseBody = await res.clone().json();
      } catch {
        responseBody = await res.text();
      }

      setResponse({
        status: res.status,
        statusText: res.statusText,
        body: responseBody,
        time: time,
      });

    } catch (error: any) {
      const endTime = Date.now();
      const time = endTime - startTime;
      setResponse({
        status: 0,
        statusText: 'Network Error',
        body: { error: error.message || 'An unknown error occurred' },
        time: time,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAI = async () => {
    if (!request.url || request.method === 'GET' || request.method === 'DELETE') {
        alert('Please enter a URL and use a POST, PUT, or PATCH method to generate a payload.');
        return;
    }

    // 1. Get a prompt from the user
    const userPrompt = prompt("What should the payload contain? (e.g., 'A new user named Jane Doe, email jane@test.com')");
    if (!userPrompt) return;

    setIsLoading(true);

    try {
        // 2. Call the secure backend server (Assumes it's running on port 3001)
        const response = await fetch('http://localhost:3001/generate-payload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userPrompt: userPrompt,
                method: request.method,
                url: request.url,
            }),
        });

        const data = await response.json();

        if (data.error) {
            alert(`AI Error: ${data.error}`);
        } else if (data.generatedPayload) {
            // 3. Clean up and update the request body state
            let payload = data.generatedPayload.trim();
            
            // Basic cleanup for models that occasionally add markdown wrappers
            if (payload.startsWith('```json') && payload.endsWith('```')) {
                payload = payload.substring(7, payload.length - 3).trim();
            } else if (payload.startsWith('```') && payload.endsWith('```')) {
                payload = payload.substring(3, payload.length - 3).trim();
            }

            // Check if it's still valid JSON before setting
            try {
                JSON.parse(payload);
                setRequest(prev => ({ ...prev, body: payload }));
            } catch (e) {
                // If cleanup fails, just show the raw response and let the user fix it
                setRequest(prev => ({ ...prev, body: data.generatedPayload }));
                alert("The AI generated an invalid JSON structure. Please review/correct the payload in the body editor.");
            }
        }
    } catch (error) {
        alert('Failed to connect to AI backend server at http://localhost:3001. Ensure your Node.js server is running.');
    } finally {
        setIsLoading(false);
    }
  };

  const isBodyAllowed = ['POST', 'PUT', 'PATCH'].includes(request.method);

  return (
    <section className="request-editor">
      <div className="controls">
        <select
          aria-label="method"
          value={request.method}
          onChange={(e) => setRequest({ ...request, method: e.target.value })}
          disabled={isLoading}
        >
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
          <option>PATCH</option>
        </select>
        <input
          className="url-input"
          placeholder="https://api.example.com/endpoint"
          value={request.url}
          onChange={(e) => setRequest({ ...request, url: e.target.value })}
          disabled={isLoading}
        />
        <button
          className="send"
          onClick={handleSend}
          disabled={isLoading}
        >
          {isLoading ? 'Sending...' : 'Send'}
        </button>
      </div>
      
      {/* *** FINAL FIX: Aggressive inline style to ensure display *** */}
      <div className="body-controls" style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          marginBottom: '0.5rem',
          // FORCING VISIBILITY and HEIGHT:
          display: 'flex', 
          visibility: 'visible', 
          minHeight: '30px', 
          border: '2px solid red', // *** AGGRESSIVE VISUAL MARKER ***
      }}>
        <p style={{ margin: 0, fontWeight: 'bold' }}>Request Body</p>
        <button 
          className="ai-assist" 
          onClick={handleAI} 
          disabled={isLoading || !isBodyAllowed} 
          style={{ border: '2px solid green' }} // *** AGGRESSIVE VISUAL MARKER ***
        >
          ✨ AI Assist
        </button>
      </div>
      
      <textarea
        className="body-input"
        placeholder={isBodyAllowed ? "Request body (e.g., JSON payload)" : "No body allowed for this method."}
        value={request.body}
        onChange={(e) => setRequest({ ...request, body: e.target.value })}
        disabled={isLoading || !isBodyAllowed}
      />
    </section>
  )
}

