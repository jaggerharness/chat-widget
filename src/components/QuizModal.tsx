import { useState } from "react";
import z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from "@/components/ui/button";
import { Progress } from '@/components/ui/progress';
import { CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

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

const QuizModal = ({ isOpen, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

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
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const handleComplete = () => {
    calculateScore();
    handleReset();
    onClose();
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, answer, index) => {
      return score + (quizData.quiz.questions[index].options[answer] === quizData.quiz.questions[index].correctAnswer ? 1 : 0);
    }, 0);
  };

  const progress = ((currentQuestion + 1) / quizData.quiz.questions.length) * 100;
  const score = calculateScore();

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] bg-secondary border-border/20">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {showResults ? 'Quiz Results' : 'Interactive Quiz'}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(85vh-6rem)] pr-4">
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
              <Card className="p-6 border-border/20">
                <h3 className="text-lg font-semibold mb-4 text-foreground">
                  {quizData.quiz.questions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {quizData.quiz.questions[currentQuestion].options.map((option, index) => (
                    <Button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      variant="outline"
                      className={`w-full text-left justify-start p-4 h-auto transition-all ${selectedAnswers[currentQuestion] === index
                        ? 'border-primary text-chat-button font-medium hover:bg-secondary hover:text-chat-button hover:border-chat-button'
                        : 'bg-secondary/50 border-border/20 hover:bg-secondary hover:text-chat-button hover:border-chat-button'
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
              <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/20 border-border/20 text-center relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent" />

                <div className="relative z-10">
                  {/* Score badge with animation */}
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/20 border-2 border-primary/30 mb-4">
                    <div className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      {score}/{quizData.quiz.questions.length}
                    </div>
                  </div>

                  {/* Percentage with dynamic color */}
                  <div className={`text-2xl font-semibold mb-2 ${score / quizData.quiz.questions.length >= 0.8
                    ? 'text-green-500'
                    : score / quizData.quiz.questions.length >= 0.6
                      ? 'text-yellow-500'
                      : 'text-red-400'
                    }`}>
                    {Math.round((score / quizData.quiz.questions.length) * 100)}%
                  </div>

                  {/* Performance message */}
                  <p className="text-muted-foreground mb-4">
                    {score === quizData.quiz.questions.length
                      ? "Perfect score! 🎉"
                      : score / quizData.quiz.questions.length >= 0.8
                        ? "Excellent work! 👏"
                        : score / quizData.quiz.questions.length >= 0.6
                          ? "Good job! 👍"
                          : "Keep practicing! 💪"}
                  </p>

                  <Progress
                    value={(score / quizData.quiz.questions.length) * 100}
                    className={`h-2 mb-2 ${score / quizData.quiz.questions.length >= 0.8
                      ? '[&>div]:bg-green-500'
                      : score / quizData.quiz.questions.length >= 0.6
                        ? '[&>div]:bg-yellow-500'
                        : '[&>div]:bg-red-400'
                      }`}
                  />

                  {/* Breakdown stats */}
                  <div className="flex justify-center space-x-6 text-sm text-muted-foreground mt-4">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Correct: {score}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <XCircle className="h-4 w-4 text-red-400" />
                      <span>Incorrect: {quizData.quiz.questions.length - score}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Answer Review */}
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">Review Your Answers:</h3>
                {quizData.quiz.questions.map((question, qIndex) => (
                  <Card className="p-4 bg-secondary border-border">
                    <div className="flex items-start space-x-3">
                      {(question.options[selectedAnswers[qIndex]] === question.correctAnswer) ? (
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
                        {(question.options[selectedAnswers[qIndex]] !== question.correctAnswer) && (
                          <p className="text-xs text-green-600 font-semibold">
                            Correct answer: {question.correctAnswer}
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
                  onClick={handleComplete}
                  variant="outline"
                >
                  Back To Chat
                </Button>
                <Button
                  onClick={handleReset}
                  variant="default"
                >
                  Retake Quiz
                </Button>
              </div>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog >
  );
};

export default QuizModal;