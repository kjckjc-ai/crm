# Personal CRM - Deployment Instructions

This document provides instructions for deploying your personal CRM system.

## Project Overview

This is a responsive Customer Relationship Management (CRM) system built with Next.js that allows you to:

- Manage contacts, organizations, and interactions
- Search across all data with filtering capabilities
- Access the system from any device with a responsive, mobile-friendly interface

## Deployment Options

You have several free options for deploying this application:

### 1. Vercel (Recommended)

Vercel is optimized for Next.js applications and offers the simplest deployment process:

1. Create a free account at [vercel.com](https://vercel.com)
2. Install Git if you don't have it already
3. Create a new repository on GitHub, GitLab, or Bitbucket
4. Push this project to your repository
5. Connect your repository to Vercel
6. Vercel will automatically deploy your application

### 2. Netlify

Netlify also offers free hosting for personal projects:

1. Create a free account at [netlify.com](https://netlify.com)
2. Push this project to a Git repository
3. Connect your repository to Netlify
4. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

### 3. GitHub Pages

If you prefer GitHub Pages:

1. Push this project to a GitHub repository
2. Enable GitHub Pages in your repository settings
3. Configure GitHub Actions to build and deploy your Next.js app

## Local Development

To run the application locally:

1. Install Node.js (version 18 or later)
2. Navigate to the project directory
3. Run `npm install` to install dependencies
4. Run `npm run dev` to start the development server
5. Open `http://localhost:3000` in your browser

## Database Setup

The application uses a SQLite database for data storage:

1. The database schema is defined in `migrations/0001_initial.sql`
2. For local development, the database will be created automatically
3. For production, you'll need to run the migrations on your hosting provider

## Features

- **Contacts Management**: Store and organize contact information
- **Organizations Tracking**: Keep track of schools, trusts, and other organizations
- **Interaction Logging**: Record meetings, calls, and other interactions
- **Tagging System**: Use the "Related to" field to tag and categorize entries
- **Comprehensive Search**: Find information across all data types
- **Mobile-Friendly Interface**: Access your CRM from any device

## Customization

You can customize the application by:

1. Modifying the UI components in `src/components/ui`
2. Adjusting the database schema in `migrations/0001_initial.sql`
3. Extending the API endpoints in `src/app/api`

## Support

This is a personal CRM system designed for individual use. It's built to be simple, secure, and free to deploy and maintain.
