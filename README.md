# Snapgram

Snapgram is an innovative social media platform designed to enhance user interaction and content sharing. Users can post content, like and save posts, explore new content, edit their profiles, discover new users, and much more. Snapgram redefines social media engagement with its cutting-edge technology and user-centric features.

## Description

Snapgram is built with a robust backend using Node.js and Express.js, leveraging a modern stack including Multer for file uploads, Cloudinary for image management, and JSON Web Token (JWT) for secure authentication. Cookie Parser and CORS ensure smooth and secure data handling, while Bcrypt.js provides reliable password hashing.

On the frontend, Snapgram employs React for dynamic and responsive user interfaces, React Router for seamless navigation, and Tailwind CSS along with the Shadcn UI library for stylish and intuitive designs. Form validation and management are handled by Zod and React Hook Forms, ensuring a smooth user experience. TanStack Query enhances data fetching capabilities, making the platform highly efficient and user-friendly.

### Additional Features:

- **Post Management:** Users can create, read, update, and delete their posts.
- **Follow and Unfollow:** Users can follow and unfollow other users to stay updated with their activities.
- **Profile Viewing:** Users can view profiles of other users, including their posts and information.
- **Discover New Users:** Explore and discover new users based on interests, location, or mutual connections.

## Features

- **User Authentication:** Secure login and registration using JWT.
- **File Uploads:** Upload images with Multer and Cloudinary integration.
- **User Interaction:** Like and save posts, explore new content, and discover new users.
- **Post Management:** CRUD operations for posts, including creation, editing, and deletion.
- **Follow and Unfollow:** Follow and unfollow other users to stay connected.
- **Profile Viewing:** View profiles of other users to see their posts and information.
- **Responsive Design:** Stylish and intuitive UI with Tailwind CSS and Shadcn UI library.
- **Data Fetching:** Efficient data handling with TanStack Query.
- **Form Validation:** Smooth form validation and management with Zod and React Hook Forms.

## Technologies Used

### Backend:

- Node.js
- Express.js
- Multer
- Cloudinary
- JSON Web Token (JWT)
- Cookie Parser
- CORS
- Bcrypt.js

### Frontend:

- React
- React Router
- Tailwind CSS
- Shadcn UI library
- Zod
- React Hook Forms
- TanStack Query

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/YourUsername/Snapgram
```

### Setup Environment Variables

Create a `.env` file in the root directory and add the following keys:

```env
MONGO_DB_URI=...
PORT=...
JWT_SECRET=...
NODE_ENV=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
```

### Running the Production Server

1. Navigate to the root directory:

   ```bash
   cd Snapgram
   ```

2. Build the project:

   ```bash
   npm run build
   ```

3. Start the production server:

   ```bash
   npm start
   ```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000) to see the application in action.

### Running the Development Server

1. Navigate to the root directory:

   ```bash
   cd Snapgram
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Start the backend development server:

   ```bash
   npm run dev
   ```

4. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

5. Install frontend dependencies:

   ```bash
   npm install
   ```

6. Start the frontend development server:

   ```bash
   npm run dev
   ```

7. Open your browser and visit [http://localhost:5173](http://localhost:5173) to see the frontend application, while the backend server runs on [http://localhost:3000](http://localhost:3000).

---

Enjoy using Snapgram, your new favorite social media platform!
