import swaggerJsdoc from 'swagger-jsdoc';
import fs from 'fs';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Books API',
      version: '1.0.0',
      description: 'API documentation for the CSE 341 Books Web Service',
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['./src/router.js'],
};

const swaggerSpec = swaggerJsdoc(options);

fs.writeFileSync('./swagger.json', JSON.stringify(swaggerSpec, null, 2));

console.log('Swagger documentation generated successfully!');