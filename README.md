# Kanban Project Manager

A full-stack Kanban board: Next.js frontend with a FastAPI + SQLite backend.
Cards, columns, and ordering persist in `backend/data/kanban.db`.

## Running the App

Start the backend (terminal 1):

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Start the frontend (terminal 2):

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. See `backend/README.md` and `frontend/README.md` for details.

## Instructions

This is a skeleton project to be the basis for your Kanban project for Week 1 of the Complete AI Coder Course. See the course resources for more.

You should clone this repo within your projects directory with:

`git clone https://github.com/ed-donner/kanban.git`

And then refine the AGENTS.md before using in your Coding Agent of choice.

If you don't have git installed, you can [install it here](https://git-scm.com/install/) and you might need to reboot afterwards.

## Contributing your AGENTS.md

If you have suggested AGENTS.md changes that have worked well for you, please contribute them to benefit other students! Follow the instructions linked [here](https://edwarddonner.com/pr) to raise a PR to put it in community_contributions. Name your file something like ED_DONNER_AGENTS.md but with your name..

I can't wait to see your changes.

## Posting your app

When you've successfully built a Kanban app, if you'd like to post about it on LinkedIn and tag me, then I'll weigh in to amplify your success and draw more attention to your achievements.

If you see other students doing this, please weigh in yourself to add your support and encouragement. It's so helpful for the community if we support each other.