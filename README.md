# Zenith Chat - Demo

## Project info

Demo chatbot application which will utilize Gemini and Vercel AI SDK. Currently, the project is able to generate text responses and generate quizzes based on the user input.

**How To Use**

Development
```sh
docker compose watch dev
```

Production
```sh
docker compose up --build prod
```

Test - Container will rm automatically after tests
```sh
docker compose run --rm test
```

Stop Containers
```sh
docker compose down
```

**Example quiz response**
```json
{
  "quiz": {
    "title": "General Knowledge Quiz",
    "questions": [
      {
        "question": "What is the capital of Australia?",
        "options": [
          "Sydney",
          "Melbourne",
          "Canberra",
          "Perth"
        ],
        "correctAnswer": "Canberra"
      },
      {
        "question": "Which planet is known as the 'Red Planet'?",
        "options": [
          "Venus",
          "Mars",
          "Jupiter",
          "Saturn"
        ],
        "correctAnswer": "Mars"
      },
      {
        "question": "What is the chemical symbol for gold?",
        "options": [
          "Au",
          "Ag",
          "Fe",
          "Cu"
        ],
        "correctAnswer": "Au"
      },
      {
        "question": "Who painted the Mona Lisa?",
        "options": [
          "Vincent van Gogh",
          "Leonardo da Vinci",
          "Pablo Picasso",
          "Michelangelo"
        ],
        "correctAnswer": "Leonardo da Vinci"
      },
      {
        "question": "What is the largest ocean on Earth?",
        "options": [
          "Atlantic Ocean",
          "Indian Ocean",
          "Arctic Ocean",
          "Pacific Ocean"
        ],
        "correctAnswer": "Pacific Ocean"
      }
    ]
  }
}
```
