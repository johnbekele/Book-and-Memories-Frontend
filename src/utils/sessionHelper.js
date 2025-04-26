export const saveCurrentPath = () => {
  // Save current path to sessionStorage when navigating
  const savePathToSession = () => {
    sessionStorage.setItem('lastPath', window.location.pathname);
  };

  // Add event listener for beforeunload
  window.addEventListener('beforeunload', savePathToSession);

  // Clean up the event listener when not needed
  return () => {
    window.removeEventListener('beforeunload', savePathToSession);
  };
};

export const restoreLastPath = (navigate) => {
  // Try to get the last path from sessionStorage
  const lastPath = sessionStorage.getItem('lastPath');

  // If there's a saved path and we're at the root or dashboard root, restore it
  if (
    lastPath &&
    (window.location.pathname === '/' ||
      window.location.pathname === '/user-dashboard')
  ) {
    navigate(lastPath);
  }
};
