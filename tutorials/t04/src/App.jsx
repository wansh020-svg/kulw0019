import { useState } from 'react';
import ScoreBoard from './components/ScoreBoard';
import UserForm from './components/UserForm';
import DataFetcher from './components/DataFetcher';
import LiveClock from './components/LiveClock';

function App() {
  const [showClock, setShowClock] = useState(false);

  return (
    <div className="app-container">
      <h1>Tutorial 4: State and Effects</h1>
      <ScoreBoard />
      <UserForm />
      <DataFetcher />
      <button className="btn-toggle" onClick={() => setShowClock(!showClock)}>
        {showClock ? 'Hide Clock' : 'Show Clock'}
      </button>
      {showClock && <LiveClock />}
    </div>
  );
}

export default App;