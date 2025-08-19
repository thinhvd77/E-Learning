const XLSX = require('xlsx');

class QuizService {
    parseExcelFile(buffer) {
        try {
            const workbook = XLSX.read(buffer, { type: 'buffer' });
            const sheetName = workbook.SheetNames[0];
            
            if (!sheetName) {
                throw new Error('No sheets found in Excel file');
            }

            const worksheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);

            if (!data || data.length === 0) {
                throw new Error('No data found in Excel file');
            }

            // Validate required columns
            const requiredColumns = ['Question', 'OptionA', 'OptionB', 'OptionC', 'OptionD', 'CorrectOptionIndex'];
            const firstRow = data[0];
            
            for (const column of requiredColumns) {
                if (!(column in firstRow)) {
                    throw new Error(`Missing required column: ${column}`);
                }
            }

            // Process and validate data
            const questions = data.map((row, index) => {
                const { Question, OptionA, OptionB, OptionC, OptionD, CorrectOptionIndex } = row;

                if (!Question || !OptionA || !OptionB || !OptionC || !OptionD) {
                    throw new Error(`Row ${index + 1}: All question fields are required`);
                }

                const correctIndex = parseInt(CorrectOptionIndex);
                if (isNaN(correctIndex) || correctIndex < 0 || correctIndex > 3) {
                    throw new Error(`Row ${index + 1}: CorrectOptionIndex must be 0, 1, 2, or 3`);
                }

                return {
                    questionText: Question.toString().trim(),
                    options: [
                        OptionA.toString().trim(),
                        OptionB.toString().trim(),
                        OptionC.toString().trim(),
                        OptionD.toString().trim()
                    ],
                    correctOptionIndex: correctIndex
                };
            });

            return questions;

        } catch (error) {
            throw new Error(`Excel parsing error: ${error.message}`);
        }
    }

    calculateQuizScore(questions, userAnswers) {
        if (!questions || !userAnswers) {
            throw new Error('Questions and answers are required');
        }

        if (questions.length !== userAnswers.length) {
            throw new Error('Number of answers must match number of questions');
        }

        let correctAnswers = 0;
        const results = [];

        questions.forEach((question, index) => {
            const userAnswer = userAnswers[index];
            const isCorrect = userAnswer === question.correctOptionIndex;
            
            if (isCorrect) {
                correctAnswers++;
            }

            results.push({
                questionIndex: index,
                userAnswer,
                correctAnswer: question.correctOptionIndex,
                isCorrect
            });
        });

        const score = (correctAnswers / questions.length) * 100;

        return {
            totalQuestions: questions.length,
            correctAnswers,
            score: Math.round(score * 100) / 100, // Round to 2 decimal places
            results
        };
    }
}

module.exports = new QuizService();