import { useState } from "react";
import "./App.css";

const API_BASE = "http://localhost:8000";

export default function App() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [jobId, setJobId] = useState("");
  const [images, setImages] = useState([]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMarkdown("");
    setJobId("");
    setImages([]);

    if (!file) {
      setError("Please choose a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/convert`, {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || "Conversion failed");
      }

      const data = await res.json();
      setMarkdown(data.markdown || "");
      setJobId(data.job_id || "");
      setImages(Array.isArray(data.images) ? data.images : []);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = (imgPath) => {
    const filename = imgPath.split("/").pop();
    return `${API_BASE}/download/${jobId}/assets/${filename}`;
  };

  return (
    <div className="page">
      <header className="hero">
        <div>
          <h1>PPT/PDF/HTML to Markdown</h1>
          <p>
            Upload a <code>.pptx</code>, <code>.pdf</code>, or <code>.html</code>
            file. Images are saved and referenced in the generated markdown.
          </p>
        </div>
      </header>

      <main className="content">
        <section className="panel">
          <form onSubmit={onSubmit} className="form">
            <label className="file-input">
              <input
                type="file"
                accept=".pptx,.pdf,.html,.htm"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <span>{file ? file.name : "Choose a file"}</span>
            </label>
            <button type="submit" disabled={loading}>
              {loading ? "Converting..." : "Convert"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </section>

        <section className="panel">
          <div className="panel-header">
            <h2>Markdown Output</h2>
            {jobId && (
              <a
                className="download"
                href={`${API_BASE}/download/${jobId}/bundle`}
                download
              >
                Download .zip
              </a>
            )}
          </div>
          <textarea
            className="markdown"
            value={markdown}
            readOnly
            placeholder="Converted markdown will appear here..."
          />
        </section>

        <section className="panel">
          <h2>Saved Images</h2>
          {images.length === 0 ? (
            <p className="muted">No images found in this file.</p>
          ) : (
            <div className="images">
              {images.map((imgPath) => (
                <div key={imgPath} className="image-card">
                  <img src={imageUrl(imgPath)} alt={imgPath} />
                  <code>{imgPath}</code>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
