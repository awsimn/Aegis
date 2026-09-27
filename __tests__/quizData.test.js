

const { QUIZZES } = require('../src/data/quizData');

describe('Quiz Data', () => {
  
  describe('Quiz Structure', () => {
    test('should export a non-empty QUIZZES array', () => {
      expect(Array.isArray(QUIZZES)).toBe(true);
      expect(QUIZZES.length).toBeGreaterThan(0);
    });

    test('every quiz should have required fields', () => {
      QUIZZES.forEach((quiz) => {
        expect(quiz).toHaveProperty('id');
        expect(quiz).toHaveProperty('title');
        expect(quiz).toHaveProperty('description');
        expect(quiz).toHaveProperty('icon');
        expect(quiz).toHaveProperty('gradient');
        expect(quiz).toHaveProperty('questions');
      });
    });

    test('every quiz should have a unique ID', () => {
      const ids = QUIZZES.map((q) => q.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });

    test('every quiz gradient should have 2+ colors', () => {
      QUIZZES.forEach((quiz) => {
        expect(Array.isArray(quiz.gradient)).toBe(true);
        expect(quiz.gradient.length).toBeGreaterThanOrEqual(2);
      });
    });
  });

  
  describe('Question Structure', () => {
    test('every quiz should have at least 5 questions', () => {
      QUIZZES.forEach((quiz) => {
        expect(quiz.questions.length).toBeGreaterThanOrEqual(5);
      });
    });

    test('every question should have questionText and answerOptions', () => {
      QUIZZES.forEach((quiz) => {
        quiz.questions.forEach((q) => {
          expect(q).toHaveProperty('questionText');
          expect(q).toHaveProperty('answerOptions');
          expect(typeof q.questionText).toBe('string');
          expect(q.questionText.length).toBeGreaterThan(0);
        });
      });
    });

    test('every question should have exactly 4 answer options', () => {
      QUIZZES.forEach((quiz) => {
        quiz.questions.forEach((q) => {
          expect(q.answerOptions.length).toBe(4);
        });
      });
    });

    test('every answer option should have answerText and isCorrect', () => {
      QUIZZES.forEach((quiz) => {
        quiz.questions.forEach((q) => {
          q.answerOptions.forEach((opt) => {
            expect(opt).toHaveProperty('answerText');
            expect(opt).toHaveProperty('isCorrect');
            expect(typeof opt.answerText).toBe('string');
            expect(typeof opt.isCorrect).toBe('boolean');
          });
        });
      });
    });
  });

  
  describe('Answer Integrity', () => {
    test('every question should have exactly one correct answer', () => {
      QUIZZES.forEach((quiz) => {
        quiz.questions.forEach((q) => {
          const correctCount = q.answerOptions.filter((a) => a.isCorrect).length;
          expect(correctCount).toBe(1);
        });
      });
    });

    test('every question should have exactly three wrong answers', () => {
      QUIZZES.forEach((quiz) => {
        quiz.questions.forEach((q) => {
          const wrongCount = q.answerOptions.filter((a) => !a.isCorrect).length;
          expect(wrongCount).toBe(3);
        });
      });
    });

    test('no answer text should be empty', () => {
      QUIZZES.forEach((quiz) => {
        quiz.questions.forEach((q) => {
          q.answerOptions.forEach((opt) => {
            expect(opt.answerText.trim().length).toBeGreaterThan(0);
          });
        });
      });
    });
  });

  
  describe('Specific Quiz Coverage', () => {
    test('should have a general preparedness quiz', () => {
      const general = QUIZZES.find((q) => q.id === 'general');
      expect(general).toBeDefined();
      expect(general.title).toContain('General');
    });

    test('should have an earthquake quiz', () => {
      const eq = QUIZZES.find((q) => q.id === 'earthquake');
      expect(eq).toBeDefined();
    });

    test('should have a flood quiz', () => {
      const fl = QUIZZES.find((q) => q.id === 'flood');
      expect(fl).toBeDefined();
    });

    test('should have a fire quiz', () => {
      const fi = QUIZZES.find((q) => q.id === 'fire');
      expect(fi).toBeDefined();
    });

    test('should have a first aid quiz', () => {
      const fa = QUIZZES.find((q) => q.id === 'firstaim');
      expect(fa).toBeDefined();
    });

    test('should have a storm quiz', () => {
      const st = QUIZZES.find((q) => q.id === 'storm');
      expect(st).toBeDefined();
    });
  });
});
