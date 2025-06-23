# phase-1-blog-project

## Overview

A basic web application for managing blog posts. Users can view, add, update, and delete posts dynamically. It features a JavaScript frontend that communicates with a local mock API (JSON Server).

## Setup & Run

1.  **Clone this repository.**
2.  **Install JSON Server:** `npm install -g json-server@0.17.4`
3.  **Start Backend:** In your project folder, run `json-server --watch db.json`
4.  **Start Frontend:** In a separate terminal in your project folder, run `live-server` (or open `index.html` directly in browser).

## Features

*   Display all post titles.
*   Click a title to see post details.
*   Add new posts (updates frontend list).
*   (Advanced) Edit post title/content (updates frontend).
*   (Advanced) Delete posts (removes from frontend).
*   (Extra Advanced) Persist changes via API (`POST`, `PATCH`, `DELETE` requests).

## Structure
This project contains the following files and folders:

project-folder/
├── index.html
├── db.json
├── css/
│   └── styles.css
└── src/
    └── index.js

## Author
Sarah Sululu

