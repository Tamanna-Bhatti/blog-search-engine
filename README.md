# Blog Search Engine

A modern blog search engine with crawling and classification capabilities. Built with React (frontend) and Node.js/Express (backend).

## Features

- 🔍 Advanced blog search functionality
- 🕷️ Web crawler for discovering new blog content
- 🏷️ Blog classification system
- 💫 Modern, responsive UI with animations
- ⚡ Fast and efficient search results
- 📱 Mobile-friendly design

## Tech Stack

### Frontend
- React
- Tailwind CSS
- React Router
- Modern UI/UX with animations

### Backend
- Node.js
- Express
- SQLite3
- Puppeteer for crawling

## Production Deployment

### Frontend (Vercel)

1. Push your code to a GitHub repository

2. Visit [Vercel](https://vercel.com) and create a new project

3. Import your GitHub repository

4. Configure the build settings:
   - Framework Preset: Create React App
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

5. Add environment variables in Vercel dashboard:
   ```
   REACT_APP_BACKEND_URL=https://your-backend-url.onrender.com
   REACT_APP_NODE_ENV=production
   ```

6. Deploy! Vercel will automatically build and deploy your frontend

### Backend (Render)

1. Push your code to a GitHub repository

2. Visit [Render](https://render.com) and create a new Web Service

3. Import your GitHub repository

4. Configure the service:
   - Name: blog-search-engine-backend
   - Environment: Node
   - Build Command: `npm install --production`
   - Start Command: `NODE_ENV=production node scripts/start-prod.js`

5. Add environment variables in Render dashboard:
   ```
   NODE_ENV=production
   PORT=5000
   FRONTEND_URL=https://your-frontend-url.vercel.app
   ```

6. Deploy! Render will automatically build and deploy your backend

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blog-search-engine.git
   cd blog-search-engine
   ```

2. Install dependencies:
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

3. Create `.env` files:

   Frontend (.env.local):
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000
   ```

   Backend (.env):
   ```
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   ```

4. Start development servers:

   Frontend:
   ```bash
   cd frontend
   npm start
   ```

   Backend:
   ```bash
   cd backend
   npm run dev
   ```

5. Visit `http://localhost:3000` to see the application

## Project Structure

```
blog-search-engine/
├── frontend/                # React frontend
│   ├── public/             # Static files
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── pages/        # Page components
│   │   └── App.js        # Main App component
│   └── package.json      # Frontend dependencies
│
├── backend/               # Node.js backend
│   ├── config/          # Configuration files
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── utils/           # Utility functions
│   └── package.json     # Backend dependencies
│
└── README.md            # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
