import listLab from './list-lab.js';
import starter from './starter.js';
import testingSort from './testing-sort.js';
import interfaces from './interfaces.js';
export const lessons = [listLab, testingSort, interfaces, starter];
export const findLesson = id => lessons.find(lesson => lesson.id === id);
