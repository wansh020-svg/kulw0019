import { useState, useEffect } from 'react';

function LiveClock() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(id);
  }, []);

  return (
    <div className="live-clock">
      Elapsed time: {seconds}s
    </div>
  );
}

export default LiveClock;