import { DragEvent, ChangeEvent, useState } from 'react';
import axios from 'axios';
import './App.css';
import robot from '../public/robot.png';

const MODEL:string = 'GPT4All';
const client = axios.create({
  baseURL: "http://127.0.0.1:7500"
});

function App() {
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [placeholder, setPlaceholder] = useState('');
  const [answer, setAnswer] = useState(''); // Initialize with a default answer
  const [current_question, setQuestion] = useState(''); // Initialize with a default answer
  //const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File>();
  const [dragIsOver, setDragIsOver] = useState(false);
  const [_files, setFiles] = useState<File[]>([]);
  interface chatinfo {
    question: string;
    answer: string;
  }
  const [chat, setChat] = useState<chatinfo[]>([]);
  const grade_promth = { 1: 'first', 2: 'second', 3: 'third', 4: 'fourth', 5: 'fifth', 6: 'sixth', 7: 'seventh', 8: 'eighth', 9: 'ninth', 10: 'tenth' }

  const chooseGrade = (grade: any) => {
    setSelectedGrade(grade);
  };

  const handleQuestionChange = (event: any) => {
    setPlaceholder(event.target.value);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragIsOver(false);

    const droppedFiles: Array<File> = Array.from(event.dataTransfer.files);
    setFiles(droppedFiles);

    droppedFiles.forEach((file) => {
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        Post_file(formData)
      }
    });
  };

  const selectFile = ((event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFile(event.target.files[0]);
    }
  })

  const Post_file = (formData: FormData) => {
    client.post('/upload', formData)
      .then((res) => {
        alert("File uploaded successfully.");
        console.log(res);
      });
    //.catch((err) => alert("File upload failed. Please try again later."));
  };

  const submitForm = (event: any) => {
    event.preventDefault();
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);
      Post_file(formData)
    }
  };
  const updatechat = (question:string,answer:string) => {
    const interaction = {question: question, answer: answer };
    setChat([...chat, interaction]);
  }

  const handleSendMessage = (question:string) => {
    if (question.trim() !== '') {
      if (selectedGrade === null) {
        alert('Please select a grade first');
        return;
      }
      const promth = " If you were explaining to an elementary student in " + grade_promth[selectedGrade] + " grade, how would you explain this: ";
      
      console.log("inside:", question)
      const addPosts = (question: string) => {
        client.post('/predict', { prompt: question, model: MODEL })
          .then((response) => {
            console.log(response.data.answer);
            setAnswer(response.data.answer);
            updatechat(question,response.data.answer);
          }
          )
      }
      addPosts(promth + question);
    }
    console.log("chat:", chat)
  };

  const handleEnterKey = (event: any) => {
    if (event.key === 'Enter') {
      setQuestion(event.target.value);
      setAnswer('Thinking...');
      handleSendMessage(event.target.value);
    }
  };


  return (
    <>
      <div className='Left'>
          <div className="chat">
           {chat.map((interaction) => (
              <div
                style={{
                  alignItems: 'flex-start',
                  marginBottom: '10px',
                  borderBlockColor: 'black',
                }}
              >
                <p style={{ margin: '0px' }}>Question: {interaction.question}</p>
                <p style={{ margin: '0px' }}>Answere: {interaction.answer}</p>
              </div>
            ))}
          </div>
      </div>
      <div className='Right'>
      <div className="header-container">
        <h1> <img src={robot} alt="Robot" className="robot-image" />  Teaching Assistant</h1>
      </div>
      <div className='Upload_file'>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          style={{
            display: 'flex',
            height: '30px',
            width: '84px',
            border: '1px dotted',
            fontSize: '0.8rem',
            backgroundColor: dragIsOver ? 'lightgray' : 'white',
            marginLeft: '231px', // Adjust the margin value as needed
          }}
        >
          Drag and drop
        </div>
        <form>
          <input
            type="file"
            onChange={selectFile}
          />
          <button onClick={submitForm}>Submit</button>
        </form>
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
              placeholder="Ask a question"
              value={placeholder}
              onChange={handleQuestionChange}
              onKeyDown={handleEnterKey}
              autoFocus
              className="question-input"
            />
          </div>
          <div className="question-display">
            <p>You said: {current_question}</p>
            <p>Teacher: {answer}</p>
          </div>
        </div>
      ) : null}
      </div>
    </>
  );
}

export default App;
