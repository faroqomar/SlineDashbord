import { useNavigate, useLocation, useSearch } from '@tanstack/react-router';

export function useRouter() {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    push: (url: string) => navigate({ to: url as any }),
    replace: (url: string) => navigate({ to: url as any, replace: true }),
    back: () => window.history.back(),
    forward: () => window.history.forward(),
    refresh: () => window.location.reload(),
    pathname: location.pathname,
  };
}

export function useSearchParams() {
  const search = useSearch({ from: '__root__' }) as Record<string, string>;
  
  return {
    get: (key: string) => search[key] || null,
    getAll: (key: string) => (search[key] ? [search[key]] : []),
    has: (key: string) => !!search[key],
    toString: () => new URLSearchParams(search).toString(),
  };
}
