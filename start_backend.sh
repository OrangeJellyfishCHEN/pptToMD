python3 -m venv backend/myvenv
source backend/myvenv/bin/activate
python -m pip install --upgrade pip setuptools wheel
pip install -r backend/requirements.txt
uvicorn backend.app:app --reload --port 8000
