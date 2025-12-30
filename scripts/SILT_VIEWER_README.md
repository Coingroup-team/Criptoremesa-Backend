# SILT Viewer

A Next.js application to view and browse SILT verification records with their associated images.

## Features

- 📋 Browse all SILT records with pagination
- 🔍 View detailed information for each SILT ID
- 🖼️ Display all verification images (ID front/back, selfie, signatures)
- 📊 Show complete JSON data for each record
- 🎨 Modern UI with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- Criptoremesa-Backend API running on https://localhost:4002
- Access to the PostgreSQL database with SILT data
- Access to the remote image server (EC2)

## Setup

1. **Install dependencies:**
   \`\`\`bash
   cd silt-viewer
   npm install
   \`\`\`

2. **Configure environment:**
   - Edit `.env.local` if needed
   - Default API URL: `https://localhost:4002`

3. **Start the backend API:**
   \`\`\`bash
   cd ../Criptoremesa-Backend
   npm run dev
   \`\`\`

4. **Start the Next.js dev server:**
   \`\`\`bash
   cd ../silt-viewer
   npm run dev
   \`\`\`

5. **Open your browser:**
   - Navigate to: http://localhost:3000

## API Endpoints (Backend)

The backend provides these endpoints:

### GET /silt
Get paginated list of SILT records

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 20)

**Response:**
\`\`\`json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 3211,
    "totalPages": 161
  }
}
\`\`\`

### GET /silt/:silt_id
Get detailed information for a specific SILT ID

**Response:**
\`\`\`json
{
  "success": true,
  "data": {
    "silt_id": "...",
    "email_user": "user@example.com",
    "silt_data": { ... },
    "fetch_date": "2025-12-30T..."
  }
}
\`\`\`

## Project Structure

\`\`\`
silt-viewer/
├── app/
│   ├── page.tsx              # Home page with list of records
│   ├── layout.tsx            # Root layout
│   └── silt/
│       └── [id]/
│           └── page.tsx      # Detail page for each SILT ID
├── components/
│   └── SiltTable.tsx         # Reusable table component
├── lib/
│   └── api.ts                # API client functions
├── types/
│   └── silt.ts               # TypeScript interfaces
└── .env.local                # Environment variables
\`\`\`

## Data Flow

1. Next.js app fetches data from Criptoremesa-Backend API
2. Backend queries PostgreSQL database (sec_cust.lnk_users_extra_data)
3. Images are served directly from AWS EC2 server
4. Frontend displays everything in a modern, paginated interface

## Image Storage

Images are stored on:
- **Server:** ec2-3-143-246-144.us-east-2.compute.amazonaws.com
- **Path:** /repo-cr/silt-data/{silt_id}/
- **Access:** Direct URLs (ensure firewall allows access)

## Development

### Run in development mode:
\`\`\`bash
npm run dev
\`\`\`

### Build for production:
\`\`\`bash
npm run build
npm start
\`\`\`

### Lint code:
\`\`\`bash
npm run lint
\`\`\`

## Technologies

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Backend:** Express.js (Criptoremesa-Backend)
- **Database:** PostgreSQL
- **Image Storage:** AWS EC2

## Troubleshooting

### Images not loading
- Check EC2 server firewall allows HTTP access
- Verify image paths are correct in the database
- Check AWS EC2 instance is running

### API connection errors
- Ensure Criptoremesa-Backend is running on port 4002
- Check HTTPS certificate is trusted
- Verify database connection in backend

### No data showing
- Run the SILT data fetcher script first
- Check database has records in lnk_users_extra_data
- Verify ms_item 'silt_full_json' exists

## Related Scripts

- **fetch-silt-data.js** - Fetches SILT data from API
- **get-silt-stats.js** - Shows database statistics
- **test-sample-failed.js** - Tests sample SILT IDs

## License

Internal Coingroup Tool
