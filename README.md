# MoMo Data Analysis Dashboard

## Overview

The **MoMo Data Analysis Dashboard** is a web-based application that allows users to upload XML files containing transaction data from Mobile Money (MoMo) messages. The system processes these files, extracts transaction details, stores them in a database, and displays them in an interactive dashboard.

## Features

- **Upload XML files** containing MoMo transaction data
- **Automatic data extraction** (Transaction ID, Amount, Sender, Receiver, Date, etc.)
- **Real-time transaction display** in a dynamic table
- **Loading indicator** during file uploads
- **Success/Error messages** after processing files
- **Data stored in a PostgreSQL database** for further analysis
- **Data filtering** to search and sort transactions by amount, date, or type

## Technologies Used

- **Frontend:** HTML, CSS, JavaScript
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Sequelize ORM
- **Parsing Library:** xml2js
- **Deployment:** Render (backend), Vercel (frontend)

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- **Node.js** (Latest LTS version)
- **PostgreSQL** (Database for storing transactions)

### Clone the Repository

```sh
git clone git+https://github.com/uwambajeddy/momo-data-analysis.git
cd momo-data-analysis
```

### Install Dependencies

```sh
npm install
```

### Setup Environment Variables

Create a `.env` file in the root directory and configure it as follows:

```
DATABASE_HOST =
DATABASE_USER =
DATABASE_PORT =
DATABASE_PASSWORD =
PRODUCTION_DATABASE =
DEV_DATABASE =
PORT =
NODE_ENV =
```

### Run Database Migrations

```sh
npm run up
```

### Start the Backend Server

```sh
npm run dev
```

The server should now be running on `http://localhost:5000`

### Start the Frontend

Open `index.html` in your browser:

## API Endpoints

### Upload Transactions (XML File)

**Endpoint:** `POST /upload`

- **Description:** Uploads an XML file and extracts transaction data
- **Request Body:** Multipart form-data with `file` parameter
- **Response:** JSON with success or error message

### Fetch Transactions

**Endpoint:** `GET /transactions`

- **Description:** Retrieves all processed transactions from the database
- **Response:** JSON array of transaction objects

## Future Improvements

- Introduce authentication & user-specific transactions
- Improve error handling & add more loading indictors

## Authors

- **Divine Birasa Laura**
- **Didier Nsengiyumva**
- **Milka Keza Isingizwe**
- **Eddy UWAMBAJE**

## License

This project is open-source and available under the [MIT License](LICENSE).
