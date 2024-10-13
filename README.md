# Custom Code Editor
<p align=middle>
<img src="./banner.svg" height="200" alt="Custom Code Editor"/>
</p>

<div align="center">
  
[![Join Our Discord](https://img.shields.io/badge/Discord-Join%20Server-blue?logo=discord&style=for-the-badge)](https://discord.com/invite/Yn9g6KuWyA)
[![Subscribe on YouTube](https://img.shields.io/badge/YouTube-Subscribe-red?logo=youtube&style=for-the-badge)](https://www.youtube.com/@dhanushnehru?sub_confirmation=1)
[![Subscribe to Newsletter](https://img.shields.io/badge/Newsletter-Subscribe-orange?style=for-the-badge)](https://dhanushn.substack.com/)

</div>


This project is a React-based code builder that utilizes the Monaco Editor. It allows users to write and execute code snippets within a web browser. It uses Judge0 as a code execution system

## Getting Started
Follow these instructions to get the project up and running on your local machine.

## Prerequisites
Node.js installed on your machine
npm or yarn package manager

## Installation
Clone the repository to your local machine:

```
git clone <repository-url>
```
- Note:- Please fill in the necessary keys in the `.env` file for successful code submissions
# Without Docker
Install dependencies using npm or yarn:
bash
```
npm install
# or
yarn install
```

To Start project
```
npm run start
```
# With Docker
## Prerequisites
Before starting with the project, ensure you have Docker installed. If not, follow these steps to install Docker:

### Docker Installation

1. **Windows**: 
   - Download Docker Desktop from [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-windows).
   - Follow the installation instructions.

2. **Mac**:
   - Download Docker Desktop from [Docker Hub](https://hub.docker.com/editions/community/docker-ce-desktop-mac).
   - Follow the installation instructions.

3. **Linux**:
   - Docker Engine installation varies by Linux distribution. Refer to [Docker's official documentation](https://docs.docker.com/engine/install/) for installation instructions specific to your Linux distribution.

To start the project using Docker Compose:
1. Build and run the project:
   ```bash
   #Detach mode
   docker-compose up -d
   ```
   ```
   docker-compose up
   ```
2. Access the project:
   - Once Docker Compose has started the containers, access the project using your web browser at `http://localhost:3000`.

3. Close project
   ```
   docker-compose down
   ```

## Setting Up Judge0 with RapidAPI

1. **Navigate to Judge0**:
   - Start by going to the [Judge0 page on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce).
   - Select the **Basic Plan**, which offers a limit of 50 requests per day.

2. **Sign Up for the Basic Plan**:
   - RapidAPI hosts Judge0, so you need to sign up for the Basic Plan on RapidAPI.
   - Follow the sign-up process to get started.

3. **Access the RapidAPI Dashboard**:
   - After signing up, go to the [RapidAPI Dashboard](https://rapidapi.com/judge0-official/api/judge0-ce).
   - In the navigation bar, select **API Hub**.

4. **Navigate to the API's Section**:
   - Click on **Endpoints** to view
   - You will see multiple endpoints such as Submissions, About, and Languages.
     
5. **Using the Submissions Endpoint**:
   - For code submissions, go to the **Submissions** endpoint and then select **Create Submission**.
   - Here, you will find `X-RapidAPI-Key`, `X-RapidAPI-Host`, and the URL (`url`) needed for API calls. Url is located below the "Code Snippets" section.

6. **Copy Required Keys**:
   - Copy the `RAPIDAPI_HOST` and `RAPIDAPI_KEY` values. These are necessary to perform API calls to the code execution system.
   - Ensure you have these keys saved as they will be used in your API requests.

By following these steps, you'll be able to set up Judge0 for code submissions using RapidAPI's infrastructure, enabling you to execute and evaluate code within your application.

## Firebase Configuration

1. Create a Firebase account at [firebase.google.com](https://firebase.google.com/) and go to the console.
2. Go to Authentication.
3. In Sign-in method, choose the Google provider.
4. Go to settings and you'll see authorized domains.
5. Add your production URL in authorized domains for our project: `https://custom-code-editor.vercel.app/`
6. Create a `.env` file in your root directory and add these values:
```
REACT_APP_FIREBASE_API_KEY=""
REACT_APP_FIREBASE_AUTH_DOMAIN=""
REACT_APP_FIREBASE_PROJECT_ID=""
REACT_APP_FIREBASE_STORAGE_BUCKET=""
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=""
REACT_APP_FIREBASE_APP_ID=""
```
## GitHub Authentication Setup

To enable GitHub authentication for the Custom Code Editor, follow these steps:

1. **Enable GitHub Authentication in Firebase Console:**
   - Go to your Firebase project in the [Firebase Console](https://firebase.google.com/).
   - Navigate to **Authentication** > **Sign-in method**.
   - Enable **GitHub** as a sign-in provider.
   - In the GitHub configuration, click **Add app**, which will take you to the GitHub Developer settings to register a new OAuth application.

2. **Register a New OAuth Application on GitHub:**
   - Go to your GitHub [Developer Settings](https://github.com/settings/developers).
   - Click on **OAuth Apps** and select **New OAuth App**.
   - Fill in the application details:
     - **Application Name**: Custom Code Editor
     - **Homepage URL**: ( `http://localhost:3000` for local development)
     - **Authorization Callback URL**: ( `http://localhost:3000` for local development)
   - Click **Register Application**.

3. **Retrieve GitHub Client ID and Client Secret:**
   - Once the app is registered, you will see the **Client ID** and **Client Secret** in the GitHub OAuth App settings. Copy these values.

4. **Add GitHub OAuth Credentials to Firebase:**
   - Return to the Firebase Console and go back to the **GitHub** provider configuration.
   - Enter the **Client ID** and **Client Secret** from GitHub.
   - Save these settings.

5. **Update Environment Variables:**
   - Open your `.env` file in your project root and add the following:

     ```plaintext
     REACT_APP_GITHUB_CLIENT_ID=YOUR_GITHUB_CLIENT_ID
     REACT_APP_GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET
     ```

   - Replace `YOUR_GITHUB_CLIENT_ID` and `YOUR_GITHUB_CLIENT_SECRET` with the values you copied from GitHub.

## Local Configuration

- Create a .env file in the root directory of your project if it doesn't already exist.
- You can copy content from `.env.example` to `.env`, you can run below command.
  ```
  cp .env.example .env
  ```
- Set the following environment variables in the .env file:

```
REACT_APP_RAPID_API_HOST=YOUR_HOST_URL
REACT_APP_RAPID_API_KEY=YOUR_SECRET_KEY
REACT_APP_RAPID_API_URL=YOUR_SUBMISSIONS_URL

# key for docker container name
COMPOSE_PROJECT_NAME=custom_code_editor
```
Replace YOUR_HOST_URL, YOUR_SECRET_KEY, & YOUR_SUBMISSIONS_URL with the appropriate values for your Rapid API and Judge0 API endpoints.

## Server Setup Configuration
Create a .env file in the root directory of your project if it doesn't already exist.
Set the JUDGE0_SUBMISSION_URL environment variable in the .env file. This variable should point to the URL of the Judge0 API endpoint you want to use for code execution. For example:
plaintext

```
JUDGE0_SUBMISSION_URL=https://api.judge0.com/submissions
```

Replace https://api.judge0.com/submissions with the appropriate URL for your Judge0 API endpoint.

Running the Development Server
Once the configuration is complete, you can start the development server to see the React code builder in action.

```
npm start
# or
yarn start
```

Open your web browser and navigate to http://localhost:3000 to access the application.

## Usage

- Write your code in the Monaco Editor.
- Execute the code snippet by clicking the "Run" button.
- View the output in the console or output panel.

## Important Information
Currently the project url is based out of the free version of judge0 this means at most one can have 50 requests per day.

##  Contributing
Contributions are welcome! Feel free to submit pull requests or open issues.

### Contributors
<a href="https://github.com/DhanushNehru/CustomCodeEditor/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=DhanushNehru/CustomCodeEditor" />
</a>

## Gitpod

In the cloud-free development environment where you can directly start coding.

You can use Gitpod in the cloud [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/DhanushNehru/CustomCodeEditor/)

----

Feel free to customize this README.md according to your project's specific requirements and features. Let me know if you need further assistance!
