# Flight Monitoring System

## 🚀 Getting Started

Follow these steps to set up and run the Flight Monitoring System on your local machine.

### 1️⃣ Clone the Repository
```sh
git clone <your-repo-url>
cd <your-repo-name>
```

### 2️⃣ Install Dependencies
```sh
npm install
```

### 3️⃣ Configure Environment Variables
- Locate the `.env.example` file in the root directory.
- Rename it to `.env`.
- Fill in the required details:
  - **MongoDB Connection String**
  - **SQL Database Credentials**
  - **AviationStack API Key**
  - **Port Number**

### 4️⃣ Fetch Initial Data into Databases
To populate your **SQL (airports)** and **MongoDB (flights)** databases with real-time data from AviationStack API, run:
```sh
node scripts/seedData.js
```

### 5️⃣ Start the Server
```sh
npm start
```
The server will start, and the delayed flight checker will run automatically every minute.

### 📜 API Documentation
For a detailed list of all available APIs, check out the Postman documentation:
🔗 [API Documentation](https://documenter.getpostman.com/view/27080842/2sAYkGKJby)

---
### 💡 Notes
- **SQL Database** is used for storing **airport** data since it remains mostly static.
- **MongoDB** is used for **flights** because flight data changes frequently.
- The system automatically detects **flights delayed by more than 120 minutes** and moves them to the **Delayed Flights** collection.
