# Git Insight API Reference

This document provides detailed information about the Git Insight API endpoints, including example requests and responses.

## Authentication

All API requests require an API key to be included in the request body.

## API Endpoints

### Validate API Key

Validates whether an API key is valid and active.

**Endpoint:** `POST /api/validate-key`

**Request Format:**

```bash
curl -X POST \
  'http://localhost:3000/api/validate-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "apiKey": "your-api-key"
  }'
```

**Successful Response (200 OK):**

```json
{
  "success": true
}
```

**Error Response (401 Unauthorized):**

```json
{
  "error": "Invalid API key"
}
```

**Error Response (500 Internal Server Error):**

```json
{
  "error": "Internal server error"
}
```

### Response Codes

| Status Code | Description                |
| ----------- | -------------------------- |
| 200         | Request successful         |
| 401         | Invalid or missing API key |
| 500         | Server error               |

## Example Usage

### Using JavaScript/Node.js

```javascript
const response = await fetch("/api/validate-key", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    apiKey: "git-insight-e9e74b9faddbf564f7734d2d5c2370af",
  }),
});

const data = await response.json();
```

### Using curl

```bash
# Example with a valid API key
curl -X POST \
  'http://localhost:3000/api/validate-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "apiKey": "git-insight-e9e74b9faddbf564f7734d2d5c2370af"
  }'

# Response: {"success":true}

# Example with an invalid API key
curl -X POST \
  'http://localhost:3000/api/validate-key' \
  -H 'Content-Type: application/json' \
  -d '{
    "apiKey": "invalid-key"
  }'

# Response: {"error":"Invalid API key"}
```

Note: The examples above use `localhost:3000` as the base URL. Replace this with your production domain when making requests to the production environment.
