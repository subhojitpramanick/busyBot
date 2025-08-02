# BusyBot - AI-Powered Productivity Suite

BusyBot is a comprehensive full-stack application designed to enhance productivity through a suite of AI-powered tools. It features a modern React frontend, a robust Node.js/Express backend, and leverages various AI and cloud services to deliver powerful functionalities.

## Features

BusyBot offers a range of AI-driven tools to streamline your workflow:

*   **AI Image Generation:** Create unique images from text prompts.
*   **Background Removal:** Easily remove backgrounds from images.
*   **Object Removal:** Seamlessly remove unwanted objects from your photos.
*   **Blog Title Generation:** Generate catchy and relevant titles for your blog posts.
*   **Article Writing Assistant:** Get assistance in drafting articles and content.
*   **Resume Review:** Analyze and improve your resume with AI feedback.
*   **User Authentication:** Secure user management powered by Clerk.
*   **Dashboard:** A personalized dashboard to manage your activities.
*   **Community:** Engage with other users and share creations.
*   **Watch Demo:** Explore the application's capabilities through a guided demonstration.

## Technology Stack

### Frontend

The client-side application is built with React and a modern development setup.

*   **Framework:** React.js
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **State Management/Data Fetching:** React Query, Axios
*   **Authentication:** Clerk React
*   **Routing:** React Router DOM
*   **Animations:** Framer Motion
*   **PDF Generation/Image Manipulation:** html2canvas, jsPDF
*   **Markdown Rendering:** Marked, React Markdown
*   **Notifications:** React Hot Toast
*   **Icons:** Lucide React

### Backend

The server-side application is powered by Node.js and Express.js, providing a scalable and efficient API.

*   **Runtime:** Node.js
*   **Web Framework:** Express.js
*   **Database:** Neon Database (PostgreSQL compatible)
*   **Authentication:** Clerk Express
*   **Cloud Storage:** Cloudinary (for image uploads and management)
*   **File Uploads:** Multer
*   **PDF Parsing:** pdf-parse
*   **Environment Variables:** dotenv
*   **CORS:** cors

## AI and API Integrations

BusyBot integrates with several powerful APIs and leverages Generative AI concepts to deliver its core functionalities:

*   **OpenAI API:** Utilized for various generative AI tasks, including:
    *   Image generation (e.g., DALL-E or similar models).
    *   Text generation for blog titles and article writing.
    *   Content analysis for resume review.
*   **Cloudinary API:** Integrated for robust image management, including:
    *   Storing generated and uploaded images.
    *   Handling image transformations required for background and object removal features.
*   **Clerk API:** Provides secure and seamless user authentication and authorization services for the application.
*   **Neon Database:** A serverless PostgreSQL database used for persistent storage of user data, generated content, and application settings.

## Getting Started

To set up and run BusyBot locally, follow these steps:

### Prerequisites

*   Node.js (v18 or higher)
*   npm or Yarn

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/busybot.git
    cd busybot
    ```

2.  **Backend Setup:**
    ```bash
    cd server
    npm install
    ```
    Create a `.env` file in the `server` directory and add your environment variables (e.g., Clerk API keys, OpenAI API key, Cloudinary credentials, Neon Database URL).

3.  **Frontend Setup:**
    ```bash
    cd ../client
    npm install
    ```
    Create a `.env` file in the `client` directory and add your environment variables (e.g., Clerk Frontend API key, Backend API URL).

### Running the Application

1.  **Start the Backend Server:**
    ```bash
    cd server
    npm run server # or npm start
    ```

2.  **Start the Frontend Development Server:**
    ```bash
    cd ../client
    npm run dev
    ```

    The frontend application will typically be available at `http://localhost:5173` (or another port as indicated by Vite).

## Project Structure

```
busybot/
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   ├── src/            # React source code
│   │   ├── assets/     # Images, icons, etc.
│   │   ├── components/ # Reusable React components
│   │   ├── pages/      # Application pages/views
│   │   └── utils/      # Utility functions
│   └── ...
└── server/             # Backend Node.js/Express application
    ├── configs/        # Configuration files (Cloudinary, DB, Multer)
    ├── controllers/    # Business logic for API endpoints
    ├── middlewares/    # Express middleware (e.g., authentication)
    ├── routes/         # API route definitions
    └── ...
```

## Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests.

## License

[Specify your license here, e.g., MIT License]