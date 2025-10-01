import React from 'react'

// Define props interface
interface ResponseViewerProps {
  response: {
    status: number;
    statusText: string;
    body: any;
    time: number | null;
  } | null;
  isLoading: boolean;
}

export default function ResponseViewer({ response, isLoading }: ResponseViewerProps) {
  let displayBody = `{ "message": "Send a request to see the response" }`;
  let statusText = '—';
  let statusClass = '';
  let responseTime = '';

  if (isLoading) {
    statusText = '...';
    displayBody = `{ "message": "Sending request..." }`;
  } else if (response) {
    // Handle status text, falling back to 'Unknown' for network error (status 0)
    statusText = response.status === 0 ? response.statusText : `${response.status} ${response.statusText || 'OK'}`;

    if (response.status >= 200 && response.status < 300) {
      statusClass = 'success';
    } else if (response.status >= 400 || response.status === 0) {
      statusClass = 'error';
    } else {
      statusClass = 'info';
    }

    if (response.time !== null) {
      responseTime = ` (${response.time}ms)`;
    }

    try {
      // Pretty-print JSON
      displayBody = JSON.stringify(response.body, null, 2);
    } catch {
      // Fallback for non-JSON text or errors
      displayBody = String(response.body);
    }
  }

  return (
    <section className="response-viewer">
      <div className="response-meta">
        Status: <strong className={statusClass}>{statusText}</strong>
        {responseTime}
      </div>
      <pre className="response-body">
        {displayBody}
      </pre>
    </section>
  )
}
