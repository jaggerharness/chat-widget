import { Dialog, DialogContent, DialogTitle } from "@radix-ui/react-dialog"
import z from 'zod';
import { DialogHeader } from "./ui/dialog";
import { Progress } from "@radix-ui/react-progress";
import { Card } from "@radix-ui/themes/components/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { CheckCircle, XCircle } from "lucide-react";

const QuizSchema = z.object({
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

type Quiz = z.infer<typeof QuizSchema>

const quizData: Quiz = {
    quiz: {
        title: "General Knowledge Quiz",
        questions: [
            {
                question: "What is the capital of Australia?",
                options: [
                    "Sydney",
                    "Melbourne",
                    "Canberra",
                    "Perth"
                ],
                correctAnswer: "Canberra"
            },
            {
                question: "Which planet is known as the 'Red Planet'?",
                options: [
                    "Venus",
                    "Mars",
                    "Jupiter",
                    "Saturn"
                ],
                correctAnswer: "Mars"
            },
            {
                question: "What is the chemical symbol for gold?",
                options: [
                    "Au",
                    "Ag",
                    "Fe",
                    "Cu"
                ],
                correctAnswer: "Au"
            },
            {
                question: "Who painted the Mona Lisa?",
                options: [
                    "Vincent van Gogh",
                    "Leonardo da Vinci",
                    "Pablo Picasso",
                    "Michelangelo"
                ],
                correctAnswer: "Leonardo da Vinci"
            },
            {
                question: "What is the largest ocean on Earth?",
                options: [
                    "Atlantic Ocean",
                    "Indian Ocean",
                    "Arctic Ocean",
                    "Pacific Ocean"
                ],
                correctAnswer: "Pacific Ocean"
            }
        ]
    }
}

const QuizModal = ({ isOpen = true }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < quizData.quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResults(true);
      setIsQuizComplete(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedAnswers([]);
    setShowResults(false);
    setIsQuizComplete(false);
  };


  const progress = ((currentQuestion + 1) / quizData.quiz.questions.length) * 100;

  return (
    <Dialog open={isOpen}>
      <DialogContent className="max-w-2xl bg-secondary border-border/20 shadow-modal">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-primary bg-clip-text text-transparent">
            {showResults ? 'Quiz Results' : 'Interactive Quiz'}
          </DialogTitle>
        </DialogHeader>

        {!showResults ? (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Question {currentQuestion + 1} of {quizData.quiz.questions.length}</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>

            {/* Question */}
            <Card className="p-6 bg-glass border-border/20">
              <h3 className="text-lg font-semibold mb-4 text-foreground">
                {quizData.quiz.questions[currentQuestion].question}
              </h3>

              <div className="space-y-3">
                {quizData.quiz.questions[currentQuestion].options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    variant="outline"
                    className={`w-full text-left justify-start p-4 h-auto transition-all ${
                      selectedAnswers[currentQuestion] === index
                        ? 'bg-chat-button/20 border-chat-button text-chat-button font-medium'
                        : 'bg-secondary/50 border-border/20 hover:bg-secondary/80'
                    }`}
                  >
                    <span className="mr-3 text-sm font-medium text-muted-foreground">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    {option}
                  </Button>
                ))}
              </div>
            </Card>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                onClick={handlePrevious}
                variant="outline"
                disabled={currentQuestion === 0}
                className="bg-secondary/50 border-border/20"
              >
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={selectedAnswers[currentQuestion] === undefined}
                className="bg-primary shadow-button hover:shadow-lg transition-all"
              >
                {currentQuestion === quizData.quiz.questions.length - 1 ? 'Finish Quiz' : 'Next'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Score Display */}
            <Card className="p-6 bg-glass border-border/20 text-center">
              <div className="text-4xl font-bold bg-primary bg-clip-text text-transparent mb-2">
                {1}/{quizData.quiz.questions.length}
              </div>
              <p className="text-lg text-muted-foreground">
                You scored {Math.round((1 / quizData.quiz.questions.length) * 100)}%!
              </p>
            </Card>

            {/* Answer Review */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Review Your Answers:</h3>
              {quizData.quiz.questions.map((question, qIndex) => (
                <Card className="p-4 bg-secondary/30 border-border/20">
                  <div className="flex items-start space-x-3">
                    {true ? (
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground mb-1">
                        {question.question}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Your answer: {question.options[selectedAnswers[qIndex]]}
                      </p>
                      {true && (
                        <p className="text-xs text-green-400">
                          Correct answer: {question.options[question.correctAnswer]}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Actions */}
            <div className="flex justify-center space-x-3">
              <Button
                className="bg-primary shadow-button hover:shadow-lg transition-all"
              >
                Continue Chat
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                className="bg-secondary/50 border-border/20"
              >
                Retake Quiz
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default QuizModal;