# Memory Limit Exceeded...

## ❓ Problem Statement

- Build a functional prototype of a platform that gives students an array of digital academic and social tools to stay engaged with their studies, peers and broader university community during pandemic.

## [VIEW LIVE DEMO](https://peaceful-fortress-48629.herokuapp.com)

## 🚧 Technology Stack

- **Server Enviornment** - NodeJS
- **Framework** - ExpressJS
- **Frontend** - ReactJS, HTML, CSS, Javascript
- **Database** - MongoDB
- **Cloud database service** - MongoDB Atlas
- **Module to send emails** - NodeMailer
- **Module to check vulnerable/toxic language** - @tensorflow-models/toxicity
- **Editor** - TinyMCE
- **Deployment** - Heroku

## ⬇️ Installation

- First, fork this repository 🍴 and follow the given instructions:

```
# clone the repository to your local machine
$ git clone `git clone https://github.com/<YOUR-GITHUB-USERNAME>/Memory-Limit-Exceeded-Backend.git`

# navigate to the project's directory and install all the relevant dev-dependencies
$ cd Memory-Limit-Exceeded-Backend && npm install

# Make a .env file and include the details as per config.js

# Start application
$ npm start

# Make requests on http://localhost:3000/ from Postman
```

## Functionalities

- Infinite Scroll on Home Page for user feed - Pagination
- Search by category, question title, question description (Infinite scroll)
- Question sorting on homescreen on the basis of timestamp and number of solution posted for a particular question
- Moderation Feature - Checks for content falling in the categories "identity_attack", "insult", "obscene", "severe_toxicity", "sexual_explicit", "threat" and"toxicity"
- Question, Solution, and Comment Posting
- Text Formatting
- When User will post a solution a notification via email will be sent to the auther of the Question

## Workflow

I have identified 9 schemas/models for the online-discussion portal.

- Questions
- Solutions
- Comments
- Users
- Categories

#### For a student

1. Register
2. Add a Question
3. Add solutions to other student's question.
4. Add a comment to any posted solution.

#### Posting a Question

1. Student need to provide the title, category(tech-stack), description to the question.
2. On sending the request the description will be checked by the tensorflow toxicity model
   - In case some toxic text are found, the question will not be posted
   - Else the question will be posted.
3. User can visit the posted question from the homescreen
4. User can format the text as per his choice. (Bold, font-size, font-family etc feature has been added using tinyMCE)

#### Posting a Solution

1. Student need to provide the description of the solution.
2. On sending the request the description will be checked by the tensorflow toxicity model
   - In case some toxic text are found, the solution will not be posted
   - Else the solution will be posted.
   - Email will be sent to the author of the question with the link to the question
3. User can visit the posted solution from the homescreen
4. User can format the text as per his choice. (Bold, font-size, font-family etc feature has been added using tinyMCE)

#### Posting Comments

1. Student can add a comment to any solution.
2. On sending the request the description of the comment will be checked by the tensorflow toxicity model
   - In case some toxic text are found, the solution will not be posted
   - Else the solution will be posted.
3. User can visit the posted comments from the homescreen

### Pending Tasks

- Unit Tests - Due to shortage of time, I couldn't write any unit-test.

### Additional Features to be added after Hackathon:

- Upvotes/Downvotes for a particular solution
- UI could be improved and made a little more attractive
- In case of toxic content user can be penalized by either blocking or setting a duration in which he/she will not be allowed to post
