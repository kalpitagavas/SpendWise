SpendWise - Full Stack Finance Tracker
SpendWise is a streamlined personal finance application that allows users to track their expenses and manage their budget through a clean, responsive interface.

🚀 Live Demo
Frontend: https://spend-wise-lovat.vercel.app

Backend: https://spendwise-51bu.onrender.com

🛠️ Tech Stack
Frontend: React.js, Vite, Axios

Backend: Node.js, Express.js

Database: MongoDB Atlas

Deployment: Vercel (Frontend) & Render (Backend)

⚙️ Features
User Authentication: Secure Sign Up and Login functionality.

Expense Management: Add, delete, and view financial records.

RESTful API: Robust backend architecture with secure CORS configurations.

Cloud Database: Real-time data storage using MongoDB Atlas.

💻 Local Setup
Clone the repository:

Bash

git clone <your-repo-link>
Backend Setup:

Navigate to the backend folder.

Create a .env file and add:

Code snippet

URL=your_mongodb_connection_string
PORT=8000
Install dependencies: npm install

Start server: npm run dev

Frontend Setup:

Navigate to the frontend folder.

Create a .env file and add:

Code snippet

VITE_API_URL=http://localhost:8000
Install dependencies: npm install

Start development server: npm run dev

🌐 Deployment Notes
CORS: The backend is configured to accept requests from the Vercel production domain and local development.

Cold Starts: Since the backend is hosted on Render's free tier, the first request after 15 minutes of inactivity may take ~50 seconds to respond as the instance "wakes up".
