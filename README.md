# Cybercafe Backend Application

This project is based on Node.js, and I'm working on it to learn backend technologies and how they function.

## Technologies Used

- Node.js
- Express
- Mongoose
- JavaScript
- MongoDB Atlas

## Project Overview

In this backend application, I have learned how to create a backend application and understand its workings.

### Database

I have created a database named `Cybercafe` using MongoDB. The data is stored and managed within this database. The file `db.js` is responsible for establishing the connection with the database.

### Entry Point

The file `index.js` serves as the entry point for the project. It connects to the project and allows us to interact with the application for basic operations such as create, read, update, and delete (CRUD).

### Schemas and Routers

In this project, I have created schemas for two entities: `People` and `Customer`. Additionally, there are router files for both of them to handle the respective CRUD operations.

### MongoDB Atlas

I have used MongoDB Atlas for the online database, which enables us to upload data online and interact with it for CRUD operations.

## Project Structure

Cybercafe-Backend/
├── db.js # Database connection file
├── index.js # Entry point of the application
├── models/
│ ├── peopleSchema.js # People schema
│ └── customerSchema.js # Customer schema
├── routes/
│ ├── peopleRouter.js # People router
│ └── customerRouter.js # Customer router
├── package.json # Project dependencies and scripts
└── README.md # Project documentation

## API Endpoints

## People
Create: POST /people
Read: GET /people
Read: GET /people:gender
Update: PUT /people/:id
Delete: DELETE /people/:id

## Customer
Create: POST /customer
Read: GET /customer
Read: GET /customer:gender
Update: PUT /customer/:id
Delete: DELETE /customer/:id
