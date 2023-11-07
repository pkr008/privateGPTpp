import React, { useState } from 'react';
import './App.css';

function App() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [latestQuestion, setLatestQuestion] = useState('');
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState(['I don\'t know']); // Initialize with a default answer
  const [question, setQuestion] = useState('');

  const chooseGrade = (grade) => {
    setSelectedGrade(grade);
  };

  const handleQuestionChange = (event) => {
    setQuestion(event.target.value);
  };

  const handleSendMessage = () => {
    if (question.trim() !== '') {
      setLatestQuestion(question);
      setQuestions([...questions, question]);
      setAnswers(['I don\'t know']); // Reset the answers when a new question is sent
      setQuestion('');
    }
  };

  const handleEnterKey = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div>
        <h1 className="top-header">Teaching Assistant</h1>
      </div>
      <div className="card">
        {selectedGrade === null ? (
          <div>
            <p>Choose Grade:</p>
            <div className="grade-buttons">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((grade) => (
                <button key={grade} onClick={() => chooseGrade(grade)}>
                  Grade {grade}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p>Grade: {selectedGrade}</p>
        )}
      </div>

      {selectedGrade !== null && typeof selectedGrade === 'number' ? (
        <div className="chat-box">
          <div className="input-box">
            <input
              type="text"
              placeholder="Send a message"
              value={question}
              onChange={handleQuestionChange}
              onKeyDown={handleEnterKey}
              autoFocus
              className="question-input" 
            />
          </div>
          <div className="question-display">
            <p>You said: {latestQuestion}</p>
            <p>Teacher: {answers[0]}</p>
          </div>
        </div>
      ) : null}
    </>
  );
}

export default App;