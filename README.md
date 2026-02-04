# Fitness Tracker App
Built by **mr_ask_chay**.

A modern, light, and interactive fitness tracking web application built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**.

## Features

### 🎯 Goal-Oriented Modes
Select your primary fitness goal to customize your experience.
⚠️ **Health Rule**: To ensure consistency, you can only switch modes **once** per session within the first 10 minutes.
- **Weight Loss**: Emerald Theme, calibrated for calorie deficit.
- **Weight Gain**: Blue Theme, focused on surplus and protein.
- **Muscle Gain**: Orange Theme, balanced for hypertrophy.

### 📊 Smart Tracking
- **Auto-Calculated Metrics**: Add an activity (Running etc.), and the app automatically calculates calories burned and steps taken based on duration and intensity.
- **Hydration Tracking**: Log your water intake easily in Liters.
- **10-Day History**: View your progress over the last 10 days with an interactive area chart.

### 🎨 Premium Design
- **Glassmorphism**: Beautiful translucent UI components.
- **Dynamic Themes**: The application changes its entire color palette based on your selected goal.
- **Responsive**: Fully optimized for desktop and mobile.

## Tech Stack
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Lucide React
- **Deployment**: Vercel

## Implementation Details
- **No Backend**: Uses `localStorage` for persistent data across sessions.
- **Privacy Focused**: data stays on your device.

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new).

---
*Developed by mr_ask_chay*
