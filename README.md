# Custom Code Builder

![Custom Code Editor (1) (2) (1) (1)-min dn (1)](https://github.com/DhanushNehru/CustomCodeEditor/assets/22955675/c24769a6-ac89-4c8a-aa6a-c5c42c186177)


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

Install dependencies using npm or yarn:
bash
```
npm install
# or
yarn install
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

## Local Configuration

- Create a .env file in the root directory of your project if it doesn't already exist.
- Set the following environment variables in the .env file:

```
REACT_APP_RAPID_API_HOST=YOUR_HOST_URL
REACT_APP_RAPID_API_KEY=YOUR_SECRET_KEY
REACT_APP_RAPID_API_URL=YOUR_SUBMISSIONS_URL
```

Replace YOUR_HOST_URL, YOUR_SECRET_KEY, and YOUR_SUBMISSIONS_URL with the appropriate values for your Rapid API and Judge0 API endpoints.

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

## Gitpod

In the cloud-free development environment where you can directly start coding.

You can use Gitpod in the cloud [![Gitpod Ready-to-Code](https://img.shields.io/badge/Gitpod-Ready--to--Code-blue?logo=gitpod)](https://gitpod.io/#https://github.com/DhanushNehru/CustomCodeEditor/)

----

Feel free to customize this README.md according to your project's specific requirements and features. Let me know if you need further assistance!

### Connect 👉 [**Twitter**](https://twitter.com/Dhanush_Nehru) **/** [**Instagram**](https://www.instagram.com/dhanush_nehru/) **/** [**Github**](https://github.com/DhanushNehru/) **/** [**Youtube**](https://www.youtube.com/@dhanushnehru?sub_confirmation=1) **/** [**Newsletter**](https://dhanushn.substack.com/) **/** [**Discord**](https://discord.com/invite/Yn9g6KuWyA)
