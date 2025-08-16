# The ChilledCloud To-Do List App

A simple, modern full-stack to-do list application. It's built with Node.js (Express), MongoDB, and vanilla JavaScript for the frontend.

This project is designed for learning:
- Docker (containerization)
- Local deployment using Docker Compose
- Cloud deployment on AWS Elastic Beanstalk (multi-container)
- (Future) CI/CD and Kubernetes

## Features

- Display to-do items
- Add new to-do items
- Mark items as complete/incomplete
- Delete to-do items

## Quick Start (Local Development)

1. **Generate package-lock.json:**
   ```bash
   npm install
   ```

2. **Run with Docker Compose:**
   ```bash
   docker-compose up -d
   ```
   *(Note: The MONGODB_URI is already set in docker-compose.yml.)*

3. **Access the App:** Open your browser and go to http://localhost:3000.


## Project Structure

```
.
├── public/                 # Frontend static files (HTML, CSS, JS)
│   ├── index.html
│   ├── script.js
│   └── style.css
├── Dockerfile              # Docker container configuration for the app
├── docker-compose.yml      # Local development setup with MongoDB
├── healthcheck.js          # Script for Docker health checks
├── package.json            # Project dependencies and scripts
├── package-lock.json       # Locks dependency versions for consistent builds
├── server.js               # Express server and API routes
├── .env.example            # Environment variables template
├── .gitignore              # Files/folders Git should ignore
└── logs/                   # (Local) Application logs
```

## Built With

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Containerization:** Docker, Docker Compose
- **Deployment:** AWS Elastic Beanstalk
