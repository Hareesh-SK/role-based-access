Client

This project was generated with Angular CLI
 version 17.3.16.

Development server

Run npm run client for a dev server. Navigate to http://localhost:4500/.
The application will automatically reload if you change any of the source files.

Build

Run ng build to build the project. The build artifacts will be stored in the dist/ directory.


Further help

To get more help on the Angular CLI use ng help or go check out the Angular CLI Overview and Command Reference
 page.

Server

This project uses Node.js + Express as a middleware server and connects with MongoDB.

Development server

Run npm run server to start the backend server. Navigate to http://localhost:5000/.
This will handle APIs like login, user management, and CRUD operations.

Database (MongoDB with Transactions)

This project supports MongoDB Transactions, so it requires MongoDB to be started in Replica Set mode.

Steps to enable transactions:

Start MongoDB as a replica set:

mongod --replSet rs0 --port 27017 --dbpath /data/db


Open Mongo shell and initiate replica set:

rs.initiate()


After this, multi-document transactions will work for bulk user operations.

Available Scripts

npm run client → Start Angular frontend (Port 4500)

npm run server → Start Node.js backend (Port 5000)

ng build → Build Angular client

API Endpoints

POST /login → Login with userId & password

GET /users → Fetch all users

POST /users → Create/Update/Delete users (transaction-based)

Sample Credentials

Insert a test user into MongoDB:

{
  "userId": "ad-01",
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "Admin@123",
  "role": "Admin"
}

{
  "userId": "gu-01",
  "name": "General User",
  "email": "generaluser@test.com",
  "password": "Generaluser123!",
  "role": "General User"
}


Login via frontend with:

UserId: admin01

Password: admin123

Project Architecture
+-----------------------+        +----------------------+
|  Angular Frontend     |        |   Node.js Backend    |
|  (http://localhost:4500) --->  |   Express APIs       |
|                           <--- |   Auth & Validation  |
+-----------------------+        +----------------------+
                                        |
                                        v
                              +----------------------+
                              |   MongoDB Database   |
                              | (Replica Set Mode)   |
                              |   Transactions       |
                              +----------------------+

Notes

Frontend runs on: http://localhost:4500

Backend runs on: http://localhost:5000

MongoDB must be running in Replica Set mode to allow transactions.