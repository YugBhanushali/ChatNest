# ChatNest

ChatNest is a real-time chat application built with Node.js, Express.js, Socket.IO for the backend, and Vite React.js with Shadcn UI for the frontend. MongoDB is used as the database to store user information and chat data.

## Features

- Real-time messaging: Chat with other users in real-time.
- User authentication: Sign up and log in to access the chat features.
- Room creation: Create chat rooms and invite others to join.
- Responsive design: Support for both desktop and mobile devices.

## Technologies Used

- **Backend**:

  - Node.js
  - Express.js
  - Socket.IO
  - MongoDB

- **Frontend**:
  - Vite (for React.js && Typescript)
  - React.js
  - Shadcn UI (for UI components)

## Getting Started

To get started with ChatNest, follow these steps:

1. Clone the repository: `git clone https://github.com/YugBhanushali/ChatNest`
2. Navigate to the project directory: `cd Chatnest`
3. Install dependencies:
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
4. Set up MongoDB:
   - Install MongoDB on your system if you haven't already.
   - Start the MongoDB server.
5. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add your MongoDB connection URI and other necessary environment variables to the `.env` file.
6. Start the servers:
   - Backend: `cd backend && npm start`
   - Frontend: `cd frontend && npm start`
7. Access the application:
   - Open your browser and navigate to `http://localhost:5173` to access the ChatNest application.

## Contributing

Contributions are welcome! If you'd like to contribute to ChatNest, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature: `git checkout -b feature-name`
3. Make your changes and commit them: `git commit -m 'Add new feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request.
