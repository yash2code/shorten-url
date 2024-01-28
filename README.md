# URL Shortener Service

This project is a URL shortener service built with a Next.js frontend, a NestJS backend, and a PostgreSQL database. It allows users to create shortened URLs and track analytics for each short link.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

What things you need to install the software:

- [Node.js](https://nodejs.org/)
- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

### Installing

A step-by-step series of examples that tell you how to get a development environment running:

1. **Clone the Repository**

   ```sh
   git clone [https://github.com/yash2code/shorten-url]
   cd [shorten-url]
   docker-compose up --build

The frontend should be accessible at http://localhost:3000
The backend API will be available at http://localhost:5000

The postman collection and db-schema image is included in the repo.
