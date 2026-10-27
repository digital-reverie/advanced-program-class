import { error } from '@sveltejs/kit';
import { findLesson } from '../../../lib/lessons/index.js';
export function load({ params }) {
  if (!findLesson(params.slug)) error(404, 'Lesson not found');
  return { slug: params.slug };
}
