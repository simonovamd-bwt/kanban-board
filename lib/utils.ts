import { Board } from '@/types';

export function generateDummyData(): Board {
  return {
    columns: [
      {
        id: 'col-1',
        title: 'To Do',
        cards: [
          {
            id: 'card-1',
            title: 'Design user interface',
            details: 'Create wireframes and mockups for the main dashboard',
          },
          {
            id: 'card-2',
            title: 'Set up project structure',
            details: 'Initialize Next.js project and configure dependencies',
          },
        ],
      },
      {
        id: 'col-2',
        title: 'In Progress',
        cards: [
          {
            id: 'card-3',
            title: 'Implement drag and drop',
            details: 'Add @dnd-kit library and implement card movement between columns',
          },
          {
            id: 'card-4',
            title: 'Create card components',
            details: 'Build reusable card component with title and details fields',
          },
          {
            id: 'card-5',
            title: 'Style the board',
            details: 'Apply color scheme and ensure responsive design',
          },
        ],
      },
      {
        id: 'col-3',
        title: 'Review',
        cards: [
          {
            id: 'card-6',
            title: 'Code review',
            details: 'Review all components for code quality and best practices',
          },
        ],
      },
      {
        id: 'col-4',
        title: 'Testing',
        cards: [
          {
            id: 'card-7',
            title: 'Write unit tests',
            details: 'Create tests for all components and utility functions',
          },
          {
            id: 'card-8',
            title: 'Integration testing',
            details: 'Set up Playwright and write end-to-end tests',
          },
        ],
      },
      {
        id: 'col-5',
        title: 'Done',
        cards: [
          {
            id: 'card-9',
            title: 'Project setup',
            details: 'Completed initial project scaffolding and configuration',
          },
        ],
      },
    ],
  };
}
