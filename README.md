# Twitter Clone

A full-featured Twitter clone built with modern technologies, featuring real-time interactions, user profiles, and a responsive design.

## Features

### Core Functionality
- **User Authentication**: Sign up and sign in with email, username, and display name
- **Tweet Management**: Create, like, and retweet posts (280 character limit)
- **User Profiles**: View user profiles with bio, follower/following counts, and tweet history
- **Social Features**: Follow/unfollow users, view user timelines
- **Real-time Updates**: Live updates for likes, retweets, and new tweets

### User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Dark/Light Mode**: Built-in theme switching with Chakra UI
- **Interactive Elements**: Hover effects, loading states, and smooth transitions
- **Navigation**: Clickable usernames and profile links throughout the app

## Technologies Used

### Frontend
- **React 18** with TypeScript for type-safe development
- **Vite** for fast development and building
- **Chakra UI** for modern, accessible component library
- **React Router** for client-side routing
- **React Query** for server state management
- **React Hook Form** for form handling

### Backend
- **Node.js** with TypeScript
- **Fastify** for high-performance HTTP server
- **tRPC** for end-to-end type safety
- **Prisma ORM** for database operations
- **JWT** for authentication
- **bcryptjs** for password hashing

### Database & Infrastructure
- **PostgreSQL** for reliable data storage
- **Docker & Docker Compose** for containerization
- **Nx** for monorepo management

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)

### Quick Start with Docker

1. Clone the repository:
```bash
git clone <repository-url>
cd twitter-clone
```

2. Start the entire application:
```bash
npm run docker:env
```

This will start:
- **PostgreSQL database** on port 5432
- **Backend API** on port 3000
- **Frontend application** on port 4200

3. Open your browser and navigate to `http://localhost:4200`

### Local Development Setup

1. Install dependencies:
```bash
npm install
```

2. Start the database:
```bash
docker compose -f docker/docker-compose.yaml up postgres -d
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Run database migrations:
```bash
npm run migrate:dev
```

5. Start the development servers:
```bash
npm run start:dev
```

## Project Structure

```
├── apps/
│   ├── backend/                 # Node.js API
│   │   ├── src/
│   │   │   ├── modules/
│   │   │   │   ├── auth/       # Authentication logic
│   │   │   │   └── tweets/     # Tweet management
│   │   │   ├── server/         # tRPC server setup
│   │   │   └── configs/        # Configuration files
│   │   └── prisma/             # Database schema and migrations
│   └── frontend/               # React application
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   └── utils/          # Utility functions
├── docker/                     # Docker configuration
└── libs/                       # Shared libraries
```

## API Endpoints

### Authentication
- `POST /trpc/auth.signUp` - Create new user account
- `POST /trpc/auth.signIn` - Sign in user
- `PUT /trpc/auth.updateProfile` - Update user profile

### Tweets
- `GET /trpc/tweets.getAll` - Get all tweets (timeline)
- `POST /trpc/tweets.create` - Create new tweet
- `GET /trpc/tweets.getUserTweets` - Get tweets by username
- `POST /trpc/tweets.like` - Like/unlike a tweet
- `POST /trpc/tweets.retweet` - Retweet/unretweet a tweet

### Users
- `GET /trpc/tweets.getUserProfile` - Get user profile by username
- `POST /trpc/tweets.follow` - Follow/unfollow a user

## Database Schema

### Users
- Basic user information (email, username, display name)
- Profile data (bio, avatar)
- Authentication data (hashed password)

### Tweets
- Tweet content (280 character limit)
- Author relationship
- Timestamps

### Interactions
- Likes (user-tweet relationship)
- Retweets (user-tweet relationship)
- Follows (user-user relationship)

## Development

### Adding New Features

1. **Backend**: Add new tRPC procedures in the appropriate module
2. **Frontend**: Create components and use tRPC hooks for data fetching
3. **Database**: Update Prisma schema and run migrations

### Running Tests

```bash
npm run test
```

### Building for Production

```bash
npm run build:frontend
npm run build:api
```

## Usage

1. **Sign Up**: Create a new account with email, username, and display name
2. **Sign In**: Log in to your account
3. **Create Tweets**: Share your thoughts in 280 characters or less
4. **Interact**: Like and retweet posts from other users
5. **Follow Users**: Click on usernames to view profiles and follow interesting users
6. **Explore**: Browse the timeline to see tweets from users you follow

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
