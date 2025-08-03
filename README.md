# SmartRec - Screen Recording Platform

A modern screen recording platform built with Next.js and Firebase, inspired by Loom. Record, edit, and share your screen recordings with ease.

## Features

- 🎥 **Screen Recording**: Record your screen, window, or browser tab
- ✂️ **Video Editing**: Trim and edit recordings with built-in tools
- 🔗 **Easy Sharing**: Share recordings via email or public links
- 💬 **Real-time Chat**: Collaborate with comments on recordings
- 📱 **Mobile Friendly**: Responsive design for all devices
- ☁️ **Cloud Storage**: Secure storage with Cloudinary integration
- 🔐 **Authentication**: Secure user authentication with Firebase

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS, Material-UI
- **Backend**: Firebase (Firestore, Storage, Realtime Database)
- **Video Processing**: Cloudinary
- **Authentication**: Firebase Auth
- **Deployment**: Vercel

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## Environment Variables

Create a `.env.local` file with:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
NEXT_PUBLIC_FIREBASE_DATABASE_URL=your_firebase_database_url

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT License - see LICENSE file for details

## Author

Muhammad Naeem
