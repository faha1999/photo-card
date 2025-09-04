# 📸 Photo Card Generator

Create customizable photo cards with templates, filters, and adjustable image settings, perfect for social media posts, brand promotions, and eCommerce marketing.

## 🚀 Live Demo

Check out the live demo: [Photo Card Generator](https://photo-card-faha1999.vercel.app)

## 🎥 Demo Preview

![Demo Preview](public/video/demo.gif)Photo Card Generator

Transform your product photos into stunning social media content with this powerful Next.js-based Photo Card Generator. Built for eCommerce businesses and digital marketers, this modern web application streamlines the creation of professional photo cards with customizable templates, advanced filters, and flexible export options. Whether you're managing an online store, running social media campaigns, or handling brand assets, this tool helps you create consistent, eye-catching visuals in seconds. Featuring real-time previews, smart image validation, and responsive design, it's the perfect solution for modern digital content creation.

> Create professional social media photo cards for your eCommerce products in seconds

[![Next.js](https://img.shields.io/badge/Next.js-15.4-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.3-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🖼️ Custom template selection and management (PNG format)
- 📤 Smart file upload with validation:
  - Photos: JPG, JPEG, PNG formats
  - Templates: PNG format only
  - 10MB size limit with validation feedback
- 🎨 Image adjustment controls:
  - Scale/resize
  - Brightness
  - Contrast
  - Grayscale
  - Sepia effects
- 📏 Guide overlay for precise positioning
- 💾 Multiple export formats (PNG/JPEG)
- 📝 Custom filename support
- 🔄 Reset and adjustment capabilities
- 📱 Responsive design with Tailwind CSS
- 🔍 Real-time preview updates

## Project Structure

```
├── public/
│   └── templates/         # Card template images
│       ├── logo.png
│       └── template.png
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── Footer.jsx    # Footer component
│   │   ├── globals.css   # Global styles
│   │   ├── layout.js     # Root layout
│   │   └── page.js       # Home page
│   ├── components/       # React components
│   │   ├── CardPreview.jsx   # Preview component
│   │   ├── Controls.jsx      # Resolution controls
│   │   └── UploadArea.jsx    # File upload area
│   └── utils/
│       └── generateCard.js    # Card generation logic
├── jsconfig.json         # JavaScript configuration
├── next.config.mjs       # Next.js configuration
├── package.json         # Project dependencies
└── postcss.config.mjs   # PostCSS configuration
```

## Getting Started

1. **Clone the repository:**

   ```bash
   git clone https://github.com/faha1999/photo-card.git
   cd photo-card
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the development server:**

   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 🛠️ Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) 15.4
- **Language:** [TypeScript](https://www.typescriptlang.org/) 5.9
- **UI Library:** [React](https://reactjs.org/) 19.1
- **Styling:** [TailwindCSS](https://tailwindcss.com/) 3.3
- **Icons:** [Lucide React](https://lucide.dev/)
- **Image Manipulation:** HTML5 Canvas API
- **Development Tools:**
  - PostCSS
  - Autoprefixer
  - ESLint
  - TypeScript Compiler

## Available Scripts

- `npm run dev` - Starts the development server
- `npm run build` - Builds the app for production
- `npm start` - Runs the built app in production mode
- `npm run lint` - Runs linting checks

## 🧩 Components

### CardPreview.tsx

- Renders the real-time preview of the photo card
- Handles image filters and effects
- Manages guide overlay functionality
- Provides final image generation

### Controls.tsx

- Manages image scaling options
- Controls filter adjustments (brightness, contrast, etc.)
- Handles filename customization
- Toggles guide overlay
- Manages export format selection

### TemplateManager.tsx

- Provides template selection interface
- Manages template previews
- Handles template switching

### UploadArea.tsx

- Manages drag-and-drop file uploads
- Handles initial image processing
- Provides upload status feedback
- Validates file types (JPG/JPEG/PNG for photos, PNG only for templates)
- Enforces 10MB file size limit
- Shows validation feedback via popups and inline messages

## 🛠️ Utils

### generateCard.ts

Contains the core logic for generating the final photo card:

- Image scaling and positioning
- Filter application
- Template overlay
- Guide rendering
- Export format handling (PNG/JPEG)
- Download functionality

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create your feature branch:
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. Commit your changes:
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. Push to the branch:
   ```bash
   git push origin feature/AmazingFeature
   ```
5. Open a Pull Request

Please ensure your PR adheres to the following:

- Follows the existing code style
- Includes appropriate tests if applicable
- Updates documentation as needed
- Maintains TypeScript type safety

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Contact

Kawsar Ahmed Fahad

- GitHub: [@faha1999](https://github.com/faha1999)

## 🌟 Show your support

Give a ⭐️ if this project helped you!
