import type { Preview } from '@storybook/react-vite';
import React, { useEffect, useMemo } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider } from '@tanstack/react-router';
import { createStorybookRouter } from './router';
import '../src/index.css';

// 1. Static QueryClient with disabled refetches
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    },
  },
});

// 2. Global Decorator for Contexts
const withProviders = (Story: any, context: any) => {
  const isDark = context.globals.theme === 'dark';

  // Apply theme to document element to trigger Tailwind dark mode
  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add('dark');
      html.classList.remove('light');
    } else {
      html.classList.remove('dark');
      html.classList.add('light'); // if needed
    }
  }, [isDark]);

  // Create a React component to wrap the Storybook render function
  const StoryComponent = useMemo(() => {
    return function StoryWrapper() {
      return <Story />;
    };
  }, [Story]);

  // Memoize the router instance per story render so it doesn't unmount on re-renders,
  // but does re-create across different stories if needed.
  const router = useMemo(() => createStorybookRouter(StoryComponent), [StoryComponent]);

  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    a11y: {
      test: 'todo',
    },
    // Adding standard backgrounds to switch between dark and light context behind the component
    backgrounds: {
      disable: true, // We rely on our theme provider for the root background color
    }
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'dark',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: ['light', 'dark'],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    withProviders,
    (Story) => (
      <div className="min-h-[200px] w-full p-8 bg-background text-foreground animate-in text-sm bg-transparent">
        <Story />
      </div>
    ),
  ],
};

export default preview;
