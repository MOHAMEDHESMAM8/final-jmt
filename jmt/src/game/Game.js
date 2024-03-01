import { useEffect } from 'react';

const Game = () => {
  useEffect(() => {
    // Redirect to your HTML page inside the folder
    window.location.href = 'http://127.0.0.1:8080/index.html?session=1';
  }, []);

  // This component doesn't render anything since it's used for redirection
  return null;
}

export default Game;
