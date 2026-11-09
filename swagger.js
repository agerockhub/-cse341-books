import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books and Authors API',
      version: '2.0.0',
      description: 'API documentation for the CSE 341 Books and Authors Web Service.',
    },
    servers: [
      {
        url: 'https://cse341-books-n3bj.onrender.com',
      },
    ],
  },
  apis: ['./src/router.js'],
};

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

console.log('Swagger documentation generated successfully!');