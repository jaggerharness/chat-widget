import z from 'zod';

export const QuizSchema = z.object({
  quiz: z.object({
    title: z.string().describe("The title of the quiz"),
    questions: z.array(
      z.object({
        question: z.string().describe("The quiz question"),
        options: z.array(z.string().describe("Multiple choice options - each question should have 4 options")),
        correctAnswer: z.string().describe("The correct multiple choice answer")
      })
    ).describe("Array of quiz questions - the quiz should contain 5 questions")
  })
});