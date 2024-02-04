import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { MutationFunction } from '@tanstack/react-query';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
