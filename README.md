# SoundCloud Clone

## Features
### User Section
- Listen to tracks, albums, and self-made or other playlists
- Add comments in real-time for a specific part and moment of song
- Create public or private playlists with likes and followers
- Each song can have lyrics that come from the Mixmath API

### Artist Panel
- Upload albums and songs
- View the number of times a song has been streamed
- View song comments, likes, and rates in a chart

### Additional Features Ideas
- User profile pages with bio and profile picture
- Social media integration for sharing songs and playlists
- Advanced search functionality with filters and sorting options
- Recommendations based on user listening history and preferences
- Podcasts and audiobooks section
- Collaborative playlists where multiple users can add songs
- Integration with third-party music analytics services
- Dark mode and customizable themes

## Technologies
- Nest.js for server-side development
- Bulls for child processes and heavy processes
- Event emitter for event-based actions like a new song release and notifying the artist's followers
- Mongoose for database management
- Websockets for real-time communication
- Throttler for rate-limiting API requests
- Redis for caching
- PM2 for process management
- JWT based authentication
- React for client-side development
- React Query for data fetching and caching
- Tailwind CSS for styling
- Jotai for state management
- React Music Player for audio playback
- Nginx for load balancing
- Docker Compose for container management
