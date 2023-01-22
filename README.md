# E-commerce website in MEVN stack

## Mongo DB, Express, Vue JS, Node JS

### Features

1. Product management (admin panel)
2. Product listing
3. Product detail
4. Shopping cart
5. Checkout (PayPal & Stripe)
6. Order management (admin panel)
7. Order detail
8. Product specifications
9. Stock management
10. Search and sort
11. New order email
12. Product reviews
13. Shipping charges by country
14. Product image compression
15. Realtime chat between users and admin

# Screenshots

![Ecommerce website in MEVN stack](https://adnan-tech.com/uploads/ECOMMERCE-WEBSITE-IN-MEVN-STACK-1.png)

# Installation

- Download and Install Node JS and Mongo DB

- Start Mongo DB server by running the following command in "bin" folder where Mongo DB is installed:
    - ./mongod
    or
    - mongod

- Then open command prompt in "server" folder and run the following command:
    - npm update
    - npm install -g nodemon
    - nodemon server.js

- Then open another command prompt in "client" folder and run the following command:
    - npm update
    - npm run serve

- Then open another command prompt in "admin" folder and run the following command:
	- npm update
    - npm run serve -- --port=8081

- Then open your browser and enter the following address for client side:
    - http://localhost:8080/

- And for admin side:
    - http://localhost:8081/

- To setup SMTP emails:
    Open server > modules > globals.js
    Then set the username and password in "nodemailerObject" variable.

If you face any problem, please feel free to contact us.

support@adnan-tech.com