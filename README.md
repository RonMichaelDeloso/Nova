# Nova

Nova is a Vue 3 frontend connected to the Express API in the sibling `NOVA_BE` folder.

## Run locally

Start the backend in one terminal:

```powershell
cd ..\NOVA_BE
npm install
npm run dev
```

Configure the backend's `.env` for its database and JWT settings before starting it. Its API listens on port `4000` by default.

Start the frontend from this repository in a second terminal:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173/`). The Vite proxy forwards `/api` requests to `http://localhost:4000`, so the frontend also works when opened using `127.0.0.1`.

To use a different backend port, set `VITE_API_PROXY_TARGET` in the frontend `.env` to the backend origin, such as `http://localhost:4001`. For a deployed frontend served behind an API reverse proxy, set `VITE_API_URL` to the API base URL.

## Backend integration

The frontend uses the Express API's `/api/auth`, `/api/cars`, `/api/bookings`, and `/api/messages` endpoints. Authentication tokens returned by login and registration are stored and sent as Bearer tokens. The dashboard reads bookings from the current user's endpoint or the administrator endpoint, and uses the API's status and message routes for admin updates.

The checked-in Django project under `backend\Nova_Step1_Backend` is a separate backend implementation and is not the API target used by the root Vue app.
