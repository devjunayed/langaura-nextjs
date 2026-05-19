# Learning Model Notes

## Structure

- A `Course` has many `Lesson` records.
- A `Lesson` can have many `SubLesson` records.
- An `Exam` can belong to either a lesson or a sub-lesson.
- `ExamQuestion.payload` and `ExamQuestion.answer` are JSON so the exact question formats can be added later without changing the schema for every exam type.

## Randomized Exams

When starting an exam:

1. Query active questions for the exam.
2. Shuffle the result.
3. Take `min(exam.questionLimit, availableQuestions.length)`.
4. Save the selected question ids into `ExamAttempt.selectedQuestionIds`.

This means the default is 20 randomized questions, but if only 7 questions exist, the learner sees those 7.

## Scale Notes

- Lesson and sub-lesson navigation should paginate or window lists instead of loading every content body.
- Lesson content should be fetched only for the active lesson or sub-lesson.
- Progress should be calculated from counts so adding new lessons or sub-lessons adjusts progress automatically.
- Indexes exist for lesson ordering, progress counts, exam question lookup, and attempts.
