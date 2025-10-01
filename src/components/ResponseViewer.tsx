import React from 'react'

export default function ResponseViewer() {
  return (
    <section className="response-viewer">
      <div className="response-meta">Status: <strong>—</strong></div>
      <pre className="response-body">{
        `{
  "message": "Send a request to see the response"
}`
      }</pre>
    </section>
  )
}
