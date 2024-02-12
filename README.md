# Discord Cloud Storage POC

This project is a Proof of Concept (POC) that explores the idea of using Discord as a cloud storage provider. It consists of three branches: Frontend, Backend, and Main. Each branch serves a specific purpose and contributes to the overall functionality of the project.

## Project as a Portfolio

This project has been made public to serve as a portfolio showcasing my development experience. It reflects the skills and expertise I gained during its development, including proficiency in file handling, Buffers, reverse engineering, and other related areas. The project aims to demonstrate my capabilities in creating innovative solutions and exploring unconventional approaches within the realm of web development.
## Branches

### 1. Frontend
This branch contains the frontend code of the project. It's responsible for the user interface and interaction with the user. The code related to the frontend is organized within its own folder in the `Main` branch.

### 2. Backend
The backend branch houses the server-side logic and functionalities. It is responsible for handling Discord authentication, communication with the Discord API, and managing interactions with the MongoDB database. Similar to the frontend, the backend code is organized within its designated folder in the `Main` branch.

### 3. Main
The Main branch serves as the integration branch, containing folders for both frontend and backend. It is the main working branch where the frontend and backend code are combined to create a functional application.

## Getting Started

To run the backend, you will need the following:

- Discord user token
- MongoDB URL

Once you have the required credentials, follow these steps:

1. Clone the repository.
2. Navigate to the backend folder.
3. Create a `.env` file and provide your Discord user token and MongoDB URL in the following format:

```env
DISCORD_TOKEN=your_discord_token_here
MONGODB_URL=your_mongodb_url_here
```

4. Save the `.env` file.
5. Start both the frontend and backend by running the following commands in each folders:

```bash
npm run dev
```

## Disclaimer

This project is created solely for educational purposes. It is not intended or recommended for production use. Engaging in any form of abuse or unauthorized use of another company's storage service, such as Discord, for personal benefit is highly illegal and goes against ethical and legal standards. The developer takes no responsibility for any misuse or illegal activities conducted with this project. Users are advised to comply with all applicable laws and terms of service when interacting with external services.
