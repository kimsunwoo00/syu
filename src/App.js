import React, { useState } from 'react';
import './App.css';
import { uploadFile } from './utils';

function App() {
    const [code, setCode] = useState('');
    const [highlightedCode, setHighlightedCode] = useState('');
    const [feedback, setFeedback] = useState('');

    const analyzeCode = () => {
        const pattern = /SELECT \* FROM [a-zA-Z_]+ WHERE [a-zA-Z_]+ = '.*'/;

        if (pattern.test(code)) {
            const newCode = code.replace(pattern, match => `<span class="highlight">${match}</span>`);
            setHighlightedCode(newCode);
            setFeedback(`문제가 있는 코드: "${code.match(pattern)[0]}"
            \n이 부분은 SQL 인젝션 공격에 취약합니다. 안전한 코드 작성을 위해 PreparedStatement를 사용해 주세요. 예시:
            \nString sql = "SELECT * FROM board WHERE b_gubun = ?";
            \nPreparedStatement pstmt = con.prepareStatement(sql);
            \npstmt.setString(1, gubun);`);
        } else {
            setHighlightedCode(code);
            setFeedback("분석 결과, SQL 인젝션 취약점이 감지되지 않았습니다.");
        }
    };

    const [fileFeedback, setFileFeedback] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileUpload = async () => {
        if (selectedFile) {
            const result = await uploadFile(selectedFile);
            setFileFeedback(result);
        } else {
            setFileFeedback('업로드할 파일을 선택하세요.');
        }
    };

    return (
        <div className="App">
            <div className="split left">
                <div className="centered">
                    <h2>소스코드 입력:</h2>
                    <textarea 
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="여기에 코드를 입력하세요..."
                    />
                    <button onClick={analyzeCode}>코드 분석</button>
                </div>
                <div className="centered">
                    <h2>파일 업로드</h2>
                    <input 
                        type="file" 
                        onChange={(e) => setSelectedFile(e.target.files[0])} 
                    />
                    <button onClick={handleFileUpload}>업로드</button>
                </div>
            </div>
            <div className="split right">
                <div className="centered">
                    <h2>코드 분석 결과:</h2>
                    <div className="code-output" dangerouslySetInnerHTML={{ __html: highlightedCode }} />
                    <div className="feedback">
                        <p>{feedback}</p>
                    </div>
                </div>
                <div className="centered">
                    <h2>파일 검사 결과:</h2>
                    <div className="feedback">
                        <p>{fileFeedback}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
