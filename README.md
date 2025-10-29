# 🚗 Vehicle Movement on Map — Frontend Assignment

A **React + Leaflet** application that simulates real-time vehicle movement along a predefined route using dummy data.
This project fulfills the assignment requirements for *Frontend Developer Intern — Vehicle Movement on a Map*.

---

## Live Demo

> [Deployed on Netlify](https://your-app-link.netlify.app)
> *(Replace this link after deployment)*

---

## Objective

To create a single-page web app that:

* Displays an interactive map
* Simulates a vehicle’s movement along a predefined route
* Provides real-time updates, route drawing, and playback controls
* Displays metadata such as coordinates, timestamp, and speed

---

## Tech Stack

| Category               | Technology                                   | Purpose              |
| ---------------------- | -------------------------------------------- | -------------------- |
| **Frontend Framework** | React.js                                     | Component-based UI   |
| **Map Library**        | React-Leaflet + Leaflet                      | Interactive mapping  |
| **Styling**            | Tailwind CSS                                 | Responsive styling   |
| **Data Source**        | JSON (dummy-route.json)                      | Vehicle route data   |
| **Optional Backend**   | Node.js + Socket.IO *(for future extension)* | Real-time simulation |

---

## Project Structure

```
vehicle-tracker-app/
├── public/
│   └── dummy-route.json        # Static dummy route data
├── src/
│   ├── components/
│   │   ├── AnimatedMarker.jsx  # Smooth marker animation
│   │   └── Controls.jsx        # UI controls & info panel
│   ├── utils.js                # Utility functions (speed calc)
│   ├── VehicleMap.jsx          # Core map + simulation logic
│   ├── App.jsx                 # Main wrapper
│   └── index.jsx               # App entry point
├── package.json
├── tailwind.config.js
└── README.md
```

---

## Setup Instructions

### 1. Clone Repository

```bash
git https://github.com/SriBoo/vehicle-tracker-assignment.git
cd vehicle-tracker-assignment
```

### **2. Install Dependencies**

i. Setup Backend
cd backend
npm install


ii. Setup Frontend

Open a new terminal and run:
cd frontend
npm install

### **3. Run Development Server**

```bash
node server.js (Backend)
The backend will start on: http://localhost:5000

npm run dev (Frontend)
Access the app at: http://localhost:5173 
```


## Features

Display an interactive **Leaflet map**
Draw complete **route polyline**
Simulate **vehicle movement** point-by-point
Smooth **marker animation** using `requestAnimationFrame`
Show **coordinates, timestamp, and speed** dynamically
**Play / Pause / Reset** controls
Fully **responsive UI** with Tailwind CSS
Easily extendable for multiple vehicles or backend integration

---

## Example Dummy Data (`dummy-route.json`)

```json
[
  { "latitude": 17.385044, "longitude": 78.486671, "timestamp": "2024-07-20T10:00:00Z" },
  { "latitude": 17.385200, "longitude": 78.486800, "timestamp": "2024-07-20T10:00:10Z" },
  { "latitude": 17.385450, "longitude": 78.487100, "timestamp": "2024-07-20T10:00:20Z" },
  { "latitude": 17.386000, "longitude": 78.488000, "timestamp": "2024-07-20T10:01:00Z" }
]
```

---

## How It Works

1. The app fetches `dummy-route.json` from `/public`
2. Each point is plotted as `[latitude, longitude]`
3. A marker moves from point to point every few seconds
   (controlled by interval or animation)
4. The polyline updates dynamically to show the traveled path
5. UI panel displays speed, coordinates, and timestamp in real time

---

## Speed Calculation

Speed is estimated using a simplified geographic distance formula:

```
distance = √((Δlat)² + (Δlon)²) × 111.32 km
speed = distance / time_delta (in hours)
```

---

## Optional Enhancements

* Multi-vehicle tracking
* Real-time updates via **Socket.IO**
* Integration with **Google Maps Directions API** or **Mapbox**
* Historical data playback
* Backend data sync with Node.js / Express

---

## Screenshots (Optional)


*Add screenshots of your deployed app here.*

---

## Author

Name: Nunna Sri Vaishnavi
Role: Frontend Developer (Assignment Submission)
GitHub: [https://github.com/SriBoo/vehicle-tracker-assignment.git]
Email: [nunnasrivyshnavi02@gmail.com]

---

##  License

This project is for educational and evaluation purposes only.
© 2025 Sri Vaishnavi. All rights reserved.
