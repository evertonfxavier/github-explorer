import { useState } from "react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <p>
          <button type="button" onClick={() => setCount((count) => count + 1)}>
            Count is {count}
          </button>
        </p>
      </div>
    </>
  );
}

export default App;
