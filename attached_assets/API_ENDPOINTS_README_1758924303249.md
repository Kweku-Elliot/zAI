## ZenuxAI API Endpoints Overview

### Per-User Memory & Conversation Support

- Most endpoints accept a `user_id` (or `user`) and `conversation_id` field.
- Each user’s memory and conversation history are isolated: responses and context are tailored per user.
- To enable conversation threading, always send the same `conversation_id` for a session.

### How to Make Requests

**Authentication:**  
- Pass your API key in the `Authorization` header as `Bearer <API_KEY>` or in `X-API-Key`.

**Request Example (JSON):**
```json
{
  "message": "What is the capital of France?",
  "conversation_id": "conv-12345",
  "user_id": "user-abc"
}
```

**File Upload Example (multipart/form-data):**
- For endpoints like `/api/file/analyze` or `/upload`, use form-data with a `file` field and optional `prompt`.

### Key Endpoints

| Endpoint                       | Method | Description                                 | Per-User Memory | Data Format         |
|---------------------------------|--------|---------------------------------------------|-----------------|---------------------|
| `/api/chat`                     | POST   | Main chat, enhanced memory & context        | Yes             | JSON                |
| `/chat`                         | POST   | Legacy chat, per-user memory                | Yes             | JSON                |
| `/v1/chat/completions`          | POST   | OpenAI-compatible, enhanced_v2 by default   | Yes             | JSON                |
| `/z1/chat/completions`          | POST   | ZenuxAI-specific, full enhanced features    | Yes             | JSON                |
| `/upload`                       | POST   | File upload, per-user limits                | Yes             | multipart/form-data |
| `/api/file/analyze`             | POST   | Analyze uploaded file                       | Yes             | multipart/form-data |
| `/v1/images/generate`           | POST   | Generate images from prompt                 | Yes             | JSON                |
| `/api/research`                 | POST   | Parallel research subsystems                | Yes             | JSON                |
| `/dev-dashboard`                | GET    | Developer dashboard (HTML)                  | N/A             | HTML                |
| `/dev/analytics`                | GET    | Analytics for dashboard                     | Yes             | JSON                |

### Data Formats

- **Chat/Completions:**  
  - Request: JSON with `message`, `conversation_id`, `user_id`, optional `files`.
  - Response: Streamed or plain text, plus headers for usage info.

- **File Upload/Analysis:**  
  - Request: multipart/form-data with `file` and optional `prompt`.
  - Response: JSON with analysis, metadata.

- **Image Generation:**  
  - Request: JSON with `prompt`, `model`, `n`, `size`, `quality`.
  - Response: JSON with image URLs.

- **Research:**  
  - Request: JSON with `query`.
  - Response: JSON with results from subsystems.

### Example: Per-User Chat Request

```http
POST /api/chat
Authorization: Bearer ZX-XXXXXXXXXXXX
Content-Type: application/json

{
  "message": "Show my last 5 conversations.",
  "conversation_id": "conv-abc123",
  "user_id": "user-xyz"
}
```

**Response:**
```json
{
  "response": "...",
  "memory": {...},
  "conversation_id": "conv-abc123",
  "user_id": "user-xyz"
}
```

---

## Detailed Endpoint Examples

### 1. Chat Endpoint (`/api/chat`)

**Request:**
```http
POST /api/chat
Authorization: Bearer ZX-XXXXXXXXXXXX
Content-Type: application/json

{
  "message": "Summarize my last 3 uploads.",
  "conversation_id": "conv-abc123",
  "user_id": "user-xyz",
  "files": ["report1.pdf", "report2.pdf"],
  "enhanced": true,
  "enhanced_v2": true
}
```

**Response:**
```json
{
  "response": "Here are summaries of your last 3 uploads...",
  "memory": {
    "recent_uploads": [
      {"file": "report1.pdf", "summary": "..."},
      {"file": "report2.pdf", "summary": "..."
    ]
  },
  "conversation_id": "conv-abc123",
  "user_id": "user-xyz"
}
```

---

### 2. File Upload & Analysis (`/api/file/analyze`)

**Request (multipart/form-data):**
```
POST /api/file/analyze
Authorization: Bearer ZX-XXXXXXXXXXXX
Content-Type: multipart/form-data

Fields:
- file: [select file]
- prompt: "Extract all tables and summarize."
- enhanced_v2: true
```

**Response:**
```json
{
  "analysis": "File 'data.xlsx' contains 4 tables. Summary: ...",
  "metadata": {
    "fileName": "data.xlsx",
    "fileSize": 204800,
    "fileType": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "timestamp": "2025-09-26T12:34:56"
  }
}
```

---

### 3. Image Generation (`/v1/images/generate`)

**Request:**
```http
POST /v1/images/generate
Authorization: Bearer ZX-XXXXXXXXXXXX
Content-Type: application/json

{
  "prompt": "A futuristic city skyline at sunset",
  "model": "zenux-dalle-3",
  "n": 2,
  "size": "1024x1024",
  "quality": "standard",
  "user_id": "user-xyz",
  "enhanced_v2": true
}
```

**Response:**
```json
{
  "data": [
    {"url": "https://placehold.co/1024x1024?text=A+futuristic+city+skyline+at+sunset"},
    {"url": "https://placehold.co/1024x1024?text=A+futuristic+city+skyline+at+sunset"}
  ]
}
```

---

### 4. Research Endpoint (`/api/research`)

**Request:**
```http
POST /api/research
Authorization: Bearer ZX-XXXXXXXXXXXX
Content-Type: application/json

{
  "query": "Latest trends in AI for healthcare",
  "user_id": "user-xyz",
  "enhanced_v2": true
}
```

**Response:**
```json
{
  "query": "Latest trends in AI for healthcare",
  "results": {
    "llm": "LLM result for 'Latest trends in AI for healthcare'",
    "rag": "RAG result for 'Latest trends in AI for healthcare'",
    "kg": "KG result for 'Latest trends in AI for healthcare'",
    "web": "Web result for 'Latest trends in AI for healthcare'",
    "memory": "Memory result for 'Latest trends in AI for healthcare'"
  }
}
```

---

### 5. Conversation Threading

**Request:**
```http
POST /api/chat
Authorization: Bearer ZX-XXXXXXXXXXXX
Content-Type: application/json

{
  "message": "Continue our last discussion about quantum computing.",
  "conversation_id": "conv-quantum-001",
  "user_id": "user-xyz",
  "enhanced_v2": true
}
```

**Response:**
```json
{
  "response": "Picking up from our last discussion, quantum computing enables...",
  "memory": {
    "previous_topic": "quantum computing"
  },
  "conversation_id": "conv-quantum-001",
  "user_id": "user-xyz"
}
```

---

