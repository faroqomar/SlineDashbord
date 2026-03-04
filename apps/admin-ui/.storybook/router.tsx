import { createRootRoute, createRoute, createRouter, createMemoryHistory } from '@tanstack/react-router';
import React from 'react';

// Factory to create a memory router for Storybook that wraps the active Story
export const createStorybookRouter = (StoryComponent: React.ComponentType) => {
  // The root route renders the Story itself, providing router context to any nested links
  const rootRoute = createRootRoute({
    component: () => <StoryComponent />,
  });

  const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
  });

  const usersRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/users',
  });

  const routeTree = rootRoute.addChildren([indexRoute, usersRoute]);

  const memoryHistory = createMemoryHistory({
    initialEntries: ['/'],
  });

  return createRouter({
    routeTree,
    history: memoryHistory,
  });
};
