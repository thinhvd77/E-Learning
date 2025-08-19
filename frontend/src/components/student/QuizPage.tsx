import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService } from '../../services/api';
import { Quiz, Question, QuizSubmission } from '../../types';
import Navbar from '../common/Navbar';
import './Student.css';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [questionId: number]: number }>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      if (!id) return;
      
      try {
        const quizData = await apiService.getQuiz(parseInt(id));
        setQuiz(quizData);
      } catch (err: any) {
        setError('Failed to load quiz');
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  const handleAnswerChange = (questionId: number, optionIndex: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmit = async () => {
    if (!quiz || !id) return;

    const answeredQuestions = Object.keys(answers).length;
    const totalQuestions = quiz.questions?.length || 0;

    if (answeredQuestions < totalQuestions) {
      if (!window.confirm(`You have only answered ${answeredQuestions} out of ${totalQuestions} questions. Submit anyway?`)) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const submission: QuizSubmission = {
        quizId: parseInt(id),
        answers: Object.entries(answers).map(([questionId, selectedOption]) => ({
          questionId: parseInt(questionId),
          selectedOption
        }))
      };

      const resultData = await apiService.submitQuiz(submission);
      setResult(resultData);
      setSubmitted(true);
    } catch (err: any) {
      setError('Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="loading">Loading quiz...</div>
        </div>
      </>
    );
  }

  if (error || !quiz) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="error-message">{error || 'Quiz not found'}</div>
          <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
        </div>
      </>
    );
  }

  if (submitted && result) {
    return (
      <>
        <Navbar />
        <div className="page-container">
          <div className="quiz-result">
            <h1>Quiz Completed!</h1>
            <div className="result-summary">
              <h2>{quiz.title}</h2>
              <div className="score">
                <span className="score-text">Your Score:</span>
                <span className="score-value">{result.score}/{result.totalQuestions}</span>
                <span className="score-percentage">
                  ({Math.round((result.score / result.totalQuestions) * 100)}%)
                </span>
              </div>
            </div>
            <div className="result-actions">
              <Link to="/dashboard" className="back-button">Back to Dashboard</Link>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="page-container">
        <div className="quiz-container">
          <div className="quiz-header">
            <Link to="/dashboard" className="back-button">← Back to Course</Link>
            <h1>{quiz.title}</h1>
            <p>Answer all questions and submit when ready.</p>
          </div>

          <div className="quiz-questions">
            {quiz.questions?.map((question: Question, index: number) => (
              <div key={question.id} className="question-card">
                <h3>Question {index + 1}</h3>
                <p className="question-text">{question.questionText}</p>
                
                <div className="options">
                  {question.options.map((option: string, optionIndex: number) => (
                    <label key={optionIndex} className="option-label">
                      <input
                        type="radio"
                        name={`question-${question.id}`}
                        value={optionIndex}
                        checked={answers[question.id] === optionIndex}
                        onChange={() => handleAnswerChange(question.id, optionIndex)}
                      />
                      <span className="option-text">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="quiz-actions">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="submit-button"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default QuizPage;