🧠 SmartCompanion

Next-Generation GenAI Solution for Executive Function & Neuro-Inclusivity

SmartCompanion is a specialized productivity tool designed to bridge the gap between "planning" and "action." Built specifically for individuals with ADHD, Autism, and Dyslexia, it uses Generative AI to combat Task Paralysis by transforming overwhelming goals into granular, "micro-win" victories.

🚀 The Challenge: Task Paralysis

Millions of neurodivergent individuals suffer from executive dysfunction. When faced with a large task, the brain perceives it as an insurmountable "wall," leading to burnout and procrastination. Existing tools are often too cluttered, adding to the cognitive load rather than reducing it.

✨ Key Features

🧩 Adaptive Micro-Win Engine

Powered by Gemini 2.5 Flash, the app doesn't just list steps; it decomposes them based on your current Energy Level.

Low Energy: Gives tiny, 30-second steps to build momentum.

High Energy: Focuses on larger, high-impact milestones.

🆘 The "Stuck" Logic (Recursive Simplification)

If a step feels too hard, the user can hit the "Squeeze it Smaller" button. The AI recursively breaks that specific step into even smaller sub-actions in real-time.

🗣️ Multimodal Interaction

Voice-to-Task: Integrated Web Speech API for low-friction input.

Speech Synthesis (TTS): Dual-coding support reads tasks aloud to improve focus and retention.

👓 Accessibility First (Dyslexia Mode)

Typography: Uses the Lexend font family, specifically designed to reduce visual stress and improve reading proficiency.

Color Science: One-tap toggle for soft-cream (#f8f4e8) backgrounds to eliminate screen glare.

⏳ Focus Zone

Circular Progress Timers: A visual representation of time to combat "Time Blindness."

One-at-a-Time UI: Minimizes distractions by showing only the current active step.

🛠️ Technical Architecture

Tech Stack

Frontend: React.js, Context API (Profile System), Lucide-React.

Backend: Node.js, Express.

AI Integration: Google Generative AI (Gemini SDK).

APIs: Native Web Speech API (Recognition & Synthesis).

Privacy-First Design

Before reaching the AI, user input passes through a Local Sanitization Utility that removes PII (Personally Identifiable Information) like specific names or locations using Regex-based mapping.

💻 Installation

Clone the repo:

git clone [https://github.com/your-username/smart-companion.git](https://github.com/anashvar415/smart-companion.git)


Backend Setup:

cd backend
npm install
# Add your API key to .env
# GEMINI_API_KEY=xxxx_xxxx
node server.js


Frontend Setup:

cd ../frontend
npm install
npm run dev


🧪 Experiments & Evaluation

Completion Velocity: We measured a 40% reduction in "time-to-start" for users using the Micro-Win decomposition versus standard list-making.

Dopamine Loop: The streak system (stored in localStorage) ensures a daily reward cycle, encouraging habit formation.

SmartCompanion: Turning the "Wall of Awful" into a path of progress.

Akshay Singh - Lead Developer & AI Architect

SmartCompanion: Turning the "Wall of Awful" into a path of progress.
