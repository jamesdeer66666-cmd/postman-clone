import React from 'react'

export default function RequestEditor() {
  return (
    <section className="request-editor">
      <div className="controls">
        <select aria-label="method">
          <option>GET</option>
          <option>POST</option>
          <option>PUT</option>
          <option>DELETE</option>
        </select>
        <input className="url-input" placeholder="https://api.example.com/endpoint" />
        <button className="send">Send</button>
      </div>
      <textarea className="body-input" placeholder="Request body (optional)" />
    </section>
  )
}
