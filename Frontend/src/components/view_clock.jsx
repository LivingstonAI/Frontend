import React, { useState, useEffect } from "react";

export default function LiveClock() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every 1000ms (1 second)

    return () => {
      clearInterval(intervalId); // Clear the interval when the component unmounts
    };
  }, []);

  return (
    <div className="live-clock">
      <h5>{currentTime.toString()}</h5>
    </div>
  );
}
