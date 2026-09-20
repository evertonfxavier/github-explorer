import { useState } from "react";
import { Button } from "@heroui/react";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div>
        <p>
          <Button onPress={() => setCount((count) => count + 1)}>
            Count is {count}
          </Button>
        </p>
      </div>
    </>
  );
}

export default App;
