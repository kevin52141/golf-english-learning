import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { CheckCircle2, X, RotateCcw, Award } from 'lucide-react'

interface QuizQuestion {
  english: string
  chinese: string
  options: string[]
  correct: number
}

const quizQuestions: QuizQuestion[] = [
  {
    english: "tee box",
    chinese: "发球台",
    options: ["发球台", "球道", "果岭", "沙坑"],
    correct: 0
  },
  {
    english: "fairway",
    chinese: "球道",
    options: ["发球台", "球道", "长草区", "果岭"],
    correct: 1
  },
  {
    english: "birdie",
    chinese: "小鸟球",
    options: ["标准杆", "小鸟球", "老鹰球", "柏忌"],
    correct: 1
  },
  {
    english: "fore!",
    chinese: "前方注意！",
    options: ["好球", "前方注意！", "运气不好", "请安静"],
    correct: 1
  },
  {
    english: "swing",
    chinese: "挥杆",
    options: ["站姿", "挥杆", "握杆", "平衡"],
    correct: 1
  },
  {
    english: "handicap",
    chinese: "差点",
    options: ["比杆赛", "差点", "罚杆", "抛球区"],
    correct: 1
  },
  {
    english: "green",
    chinese: "果岭",
    options: ["球道", "长草区", "果岭", "沙坑"],
    correct: 2
  },
  {
    english: "putter",
    chinese: "推杆",
    options: ["一号木杆", "铁杆", "推杆", "高尔夫球"],
    correct: 2
  }
]

interface VocabularyQuizProps {
  isOpen: boolean
  onClose: () => void
}

export function VocabularyQuiz({ isOpen, onClose }: VocabularyQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [userAnswers, setUserAnswers] = useState<number[]>([])

  if (!isOpen) return null

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return

    const newUserAnswers = [...userAnswers, selectedAnswer]
    setUserAnswers(newUserAnswers)

    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setShowResult(true)

    setTimeout(() => {
      if (currentQuestion < quizQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setShowResult(false)
      } else {
        setQuizCompleted(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setScore(0)
    setShowResult(false)
    setQuizCompleted(false)
    setUserAnswers([])
  }

  const currentQ = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-green-800 flex items-center">
              <Award className="w-5 h-5 mr-2" />
              高尔夫词汇测试
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          {!quizCompleted && (
            <CardDescription>
              第 {currentQuestion + 1} 题，共 {quizQuestions.length} 题
            </CardDescription>
          )}
        </CardHeader>

        <CardContent>
          {!quizCompleted ? (
            <>
              <div className="mb-6">
                <Progress value={progress} className="mb-2" />
                <p className="text-xs text-gray-600 text-center">
                  进度: {currentQuestion + 1}/{quizQuestions.length}
                </p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-center mb-2 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  {currentQ.english}
                </h3>
                <p className="text-center text-gray-600 mb-4">
                  选择正确的中文翻译：
                </p>
              </div>

              <div className="space-y-3 mb-6">
                {currentQ.options.map((option, index) => (
                  <button
                    key={`${currentQuestion}-option-${index}-${option.slice(0, 5)}`}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={showResult}
                    className={`w-full p-3 text-left rounded-lg border transition-all ${
                      selectedAnswer === index
                        ? showResult
                          ? index === currentQ.correct
                            ? 'bg-green-100 border-green-500 text-green-700'
                            : 'bg-red-100 border-red-500 text-red-700'
                          : 'bg-blue-100 border-blue-500 text-blue-700'
                        : showResult && index === currentQ.correct
                        ? 'bg-green-100 border-green-500 text-green-700'
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${showResult ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {showResult && index === currentQ.correct && (
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      )}
                      {showResult && selectedAnswer === index && index !== currentQ.correct && (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {!showResult && (
                <Button
                  onClick={handleNextQuestion}
                  disabled={selectedAnswer === null}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {currentQuestion === quizQuestions.length - 1 ? '完成测试' : '下一题'}
                </Button>
              )}

              {showResult && (
                <div className="text-center">
                  {selectedAnswer === currentQ.correct ? (
                    <div className="text-green-600">
                      <CheckCircle2 className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">回答正确！</p>
                    </div>
                  ) : (
                    <div className="text-red-600">
                      <X className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">回答错误</p>
                      <p className="text-sm text-gray-600">
                        正确答案是: {currentQ.chinese}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className="text-center">
              <div className="mb-6">
                <Award className="w-16 h-16 mx-auto text-yellow-500 mb-4" />
                <h3 className="text-2xl font-bold text-green-800 mb-2">测试完成！</h3>
                <p className="text-lg text-gray-600 mb-4">
                  你的得分: {score}/{quizQuestions.length}
                </p>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                  <div
                    className="bg-green-600 h-3 rounded-full transition-all duration-1000"
                    style={{ width: `${(score / quizQuestions.length) * 100}%` }}
                  />
                </div>
                <Badge
                  variant="outline"
                  className={`text-lg px-4 py-2 ${
                    score === quizQuestions.length
                      ? 'border-yellow-500 text-yellow-700'
                      : score >= quizQuestions.length * 0.8
                      ? 'border-green-500 text-green-700'
                      : score >= quizQuestions.length * 0.6
                      ? 'border-blue-500 text-blue-700'
                      : 'border-gray-500 text-gray-700'
                  }`}
                >
                  {score === quizQuestions.length
                    ? '🏆 完美！'
                    : score >= quizQuestions.length * 0.8
                    ? '🥇 优秀！'
                    : score >= quizQuestions.length * 0.6
                    ? '🥈 良好！'
                    : '🥉 继续努力！'
                  }
                </Badge>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={resetQuiz}
                  variant="outline"
                  className="w-full border-green-600 text-green-600 hover:bg-green-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重新测试
                </Button>
                <Button
                  onClick={onClose}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  关闭
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
