# traffic-viewer
A simple traffic viewer for Linux-based distros using vnstat.

# Requirements
- vnstat: any
- pnpm: >= 8.11.0
- node: >= 18

# Installation
1. Clone the repository
2. Create .env file in frontend directory. and set the following to your desired backend url:
```
NEXT_PUBLIC_API_URL=...
```
3. Run `pnpm build`. The static html files will be available on frontend/out directory.
4. Serve files with your favorite web server.
5. Go to backend directory, and run `pnpm start`. The backend server will start, and try visiting your web server.

# Used libraries
- [v0.dev](https://v0.dev) - used to struct frontend
- [Next.js](https://nextjs.org) - used to build frontend