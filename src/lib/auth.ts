export function isAuthenticated(): boolean {
  return (
    localStorage.getItem('focuspart_auth') === 'true' ||
    sessionStorage.getItem('focuspart_auth') === 'true'
  );
}

export function logout(): void {
  localStorage.removeItem('focuspart_auth');
  localStorage.removeItem('focuspart_remember');
  sessionStorage.removeItem('focuspart_auth');
}
