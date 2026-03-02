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

export function useSearchParams(): URLSearchParams {
  const search = useSearch({ from: '__root__' as any }) as Record<string, string>;
  const params = new URLSearchParams();
  Object.entries(search ?? {}).forEach(([k, v]) => params.set(k, String(v)));
  return params;
}

export function useSetSearchParams(): (params: URLSearchParams) => void {
  const navigate = useNavigate();
  const location = useLocation();
  return (params: URLSearchParams) => {
    const next: Record<string, string> = {};
    params.forEach((v, k) => { next[k] = v; });
    navigate({ to: location.pathname as any, search: next as any, replace: true });
  };
}
