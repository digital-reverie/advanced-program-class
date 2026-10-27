import listLab from './list-lab.js';
import starter from './starter.js';
export const lessons = [listLab, starter];
export const findLesson = id => lessons.find(lesson => lesson.id === id);
