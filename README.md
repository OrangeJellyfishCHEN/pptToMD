# pptToMD

React frontend + Python backend to convert `.pptx`, `.pdf`, or `.html` files to markdown.
Images are saved to disk and referenced by path in the generated markdown. No OCR is performed.

## Run backend

```bash
python3 -m venv backend/myvenv
source backend/myvenv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --port 8000
```

If you previously created the backend virtualenv with an older pinned `PyMuPDF`, remove `backend/myvenv` and recreate it before reinstalling. `PyMuPDF==1.24.10` often fails on Python 3.13 because pip falls back to a source build.

## Run frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Notes

- HTML images are saved if they are data URIs or local files next to the HTML file. Remote image URLs are left as-is in the markdown.
- Outputs are stored under `backend/outputs/<job_id>/`.
