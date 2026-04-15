# Backend Name Classifier API - hng-stage-0(i14)

Backend service for the Stage 0 assessment. It exposes a classify endpoint that calls Genderize, processes the payload, and returns a normalized response format.

## Stack

- Node.js + TypeScript
- Express.js
- CORS, Helmet, Morgan, Rate Limiting

## Base URL

Default local base URL:

http://localhost:4000

## Main Endpoint

### GET /api/classify?name={name}

Calls Genderize and returns:

- `name`
- `gender`
- `probability`
- `sample_size` (mapped from Genderize `count`)
- `is_confident` (`probability >= 0.7` and `sample_size >= 100`)
- `processed_at` (UTC ISO 8601 timestamp)

### Success Response (200)

```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-15T09:00:00.000Z"
  }
}
```

### Error Response Format

All errors return:

```json
{
  "status": "error",
  "message": "<error message>"
}
```

Typical status codes:

- `400` Missing or empty name query
- `422` Invalid name type
- `502` Upstream Genderize error
- `500` Internal server error

Edge case:

- If Genderize returns `gender: null` or `count: 0`, the API returns an error message: `No prediction available for the provided name`

## Other Endpoints

- `GET /` root information
- `GET /api/v1/health` health check

## Quick Start

1. Install dependencies

```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

## Running the Application

### Development

```bash
npm run dev
```

### Production

```bash
npm run build
npm start
```

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Run Prettier

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------||
| `PORT` | Server port | `4000` |
| `NODE_ENV` | Environment | `development` |


## About this Scaffold

This project was generated using the @ifecodes/backend-template scaffold. You can recreate or customize this scaffold using the CLI: 

- Run without installing (recommended): `npx ifecodes-template`
- Install globally: `npm i -g @ifecodes/backend-template` and run `ifecodes-template`

## License

MIT
