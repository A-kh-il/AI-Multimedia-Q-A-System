import { useState, useRef } from "react";

function App() {

  const [file, setFile] = useState(null);

  const [fileUrl, setFileUrl] = useState("");

  const [uploadResponse, setUploadResponse] = useState(null);

  const [question, setQuestion] = useState("");

  const [messages, setMessages] = useState([]);

  const [uploading, setUploading] = useState(false);

  const [thinking, setThinking] = useState(false);

  const mediaRef = useRef(null);

  const handleUpload = async () => {

    if (!file) {

      alert("Please select a file");

      return;
    }

    const formData = new FormData();

    formData.append("file", file);

    try {

      setUploading(true);

      const res = await fetch(
        "http://127.0.0.1:8000/upload",
        {
          method: "POST",
          body: formData
        }
      );

      const data = await res.json();

      setUploadResponse(data);

      setFileUrl(URL.createObjectURL(file));

      setUploading(false);

    } catch (error) {

      console.log(error);

      setUploading(false);

      alert("Upload failed");
    }
  };

  const handleChat = async () => {

    if (!question) return;

    const userMessage = {
      role: "user",
      content: question
    };

    setMessages((prev) => [...prev, userMessage]);

    try {

      setThinking(true);

      const res = await fetch(
        `http://127.0.0.1:8000/chat?question=${question}`,
        {
          method: "POST"
        }
      );

      const data = await res.json();

      const aiMessage = {
        role: "assistant",
        content: data.answer
      };

      setMessages((prev) => [...prev, aiMessage]);

      setQuestion("");

      setThinking(false);

    } catch (error) {

      console.log(error);

      setThinking(false);

      alert("Chat failed");
    }
  };

  const jumpToTimestamp = (time) => {

    if (mediaRef.current) {

      mediaRef.current.currentTime = time;

      mediaRef.current.play();
    }
  };

  return (

    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        color: "white",
        padding: "40px",
        fontFamily: "Segoe UI"
      }}
    >

      <div
        style={{
          maxWidth: "1000px",
          margin: "auto"
        }}
      >

        <h1
          style={{
            textAlign: "center",
            marginBottom: "10px",
            fontSize: "40px"
          }}
        >
          AI Multimedia Q&A System
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: "40px"
          }}
        >
          Upload PDFs, Audio, and Videos to chat with AI
        </p>

        {/* Upload Section */}

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px",
            boxShadow: "0 0 10px rgba(0,0,0,0.3)"
          }}
        >

          <h2>Upload File</h2>

          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {

              e.preventDefault();

              const droppedFile =
                e.dataTransfer.files[0];

              if (droppedFile) {

                setFile(droppedFile);
              }
            }}
            style={{
              border: "2px dashed #475569",
              padding: "35px",
              borderRadius: "12px",
              textAlign: "center",
              marginBottom: "20px",
              backgroundColor: "#0f172a"
            }}
          >

            <p
              style={{
                color: "#cbd5e1",
                marginBottom: "15px"
              }}
            >
              Drag & Drop File Here
            </p>

            <input
              type="file"
              onChange={(e) =>
                setFile(e.target.files[0])
              }
            />

            {file && (

              <p
                style={{
                  marginTop: "15px",
                  color: "#22c55e"
                }}
              >
                Selected: {file.name}
              </p>
            )}

          </div>

          <button
            onClick={handleUpload}
            style={{
              padding: "10px 20px",
              border: "none",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            {uploading
              ? "Uploading..."
              : "Upload"}
          </button>

        </div>

        {/* Media Preview */}

        {fileUrl &&
         file?.type.startsWith("audio") && (

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px"
            }}
          >

            <h2>Audio Preview</h2>

            <audio
              controls
              ref={mediaRef}
              src={fileUrl}
              style={{
                width: "100%"
              }}
            />

          </div>
        )}

        {fileUrl &&
         file?.type.startsWith("video") && (

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px"
            }}
          >

            <h2>Video Preview</h2>

            <video
              controls
              ref={mediaRef}
              src={fileUrl}
              width="100%"
              style={{
                borderRadius: "10px"
              }}
            />

          </div>
        )}

        {/* Upload Result */}

        {uploadResponse && (

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "30px"
            }}
          >

            <h2>Upload Status</h2>

            <p>{uploadResponse.message}</p>

            <p>
              <strong>File:</strong>{" "}
              {uploadResponse.filename}
            </p>

          </div>
        )}

        {/* Chatbot */}

        <div
          style={{
            backgroundColor: "#1e293b",
            padding: "25px",
            borderRadius: "12px",
            marginBottom: "30px"
          }}
        >

          <h2>AI Chatbot</h2>

          <input
            type="text"
            placeholder="Ask a question..."
            value={question}
            onChange={(e) =>
              setQuestion(e.target.value)
            }
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              marginBottom: "15px",
              fontSize: "15px"
            }}
          />

          <div>

            <button
              onClick={handleChat}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#16a34a",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold"
              }}
            >
              {thinking
                ? "Thinking..."
                : "Ask AI"}
            </button>

            <button
              onClick={() => setMessages([])}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "8px",
                backgroundColor: "#475569",
                color: "white",
                cursor: "pointer",
                fontWeight: "bold",
                marginLeft: "10px"
              }}
            >
              Clear Chat
            </button>

          </div>

          <div style={{ marginTop: "25px" }}>

            {messages.map((msg, index) => (

              <div
                key={index}
                style={{
                  marginBottom: "18px",
                  display: "flex",
                  justifyContent:
                    msg.role === "user"
                      ? "flex-end"
                      : "flex-start"
                }}
              >

                <div
                  style={{
                    backgroundColor:
                      msg.role === "user"
                        ? "#2563eb"
                        : "#334155",

                    padding: "14px",

                    borderRadius: "12px",

                    maxWidth: "75%",

                    boxShadow:
                      "0 0 5px rgba(0,0,0,0.3)"
                  }}
                >

                  <strong>
                    {msg.role === "user"
                      ? "You"
                      : "AI"}
                  </strong>

                  <p
                    style={{
                      marginTop: "8px",
                      lineHeight: "1.8",
                      textAlign: "justify",
                      whiteSpace: "pre-wrap"
                    }}
                  >
                    {msg.content}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

        {/* Timestamps */}

        {uploadResponse &&
         uploadResponse.segments &&
         Array.isArray(uploadResponse.segments) && (

          <div
            style={{
              backgroundColor: "#1e293b",
              padding: "25px",
              borderRadius: "12px",
              marginBottom: "30px"
            }}
          >

            <h2>Timestamps</h2>

            {uploadResponse.segments
              .slice(0, 10)
              .map((segment, index) => (

              <div
                key={index}
                style={{
                  marginBottom: "18px",
                  padding: "15px",
                  backgroundColor: "#334155",
                  borderRadius: "10px"
                }}
              >

                <button
                  onClick={() =>
                    jumpToTimestamp(
                      segment.start
                    )
                  }
                  style={{
                    padding: "8px 14px",
                    border: "none",
                    borderRadius: "6px",
                    backgroundColor: "#dc2626",
                    color: "white",
                    cursor: "pointer",
                    marginBottom: "10px",
                    fontWeight: "bold"
                  }}
                >
                  ▶ {Math.floor(segment.start)}s
                </button>

                <p
                  style={{
                    color: "#e2e8f0",
                    lineHeight: "1.8",
                    margin: 0
                  }}
                >
                  {segment.text}
                </p>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
}

export default App;