import listLab from './list-lab.js';
import starter from './starter.js';
import testingSort from './testing-sort.js';
export const lessons = [listLab, testingSort, starter];
export const findLesson = id => lessons.find(lesson => lesson.id === id);
