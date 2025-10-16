import z from 'zod';
import { QuizSchema } from './schema';

export type Quiz = z.infer<typeof QuizSchema>