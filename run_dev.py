"""
Cafe Companion - Unified Development Launcher
Starts:
1. Python FastAPI AI Engine (Port 8000)
2. Express Realtime Gateway (Port 5000)
3. Vite React Frontend (Port 5173)
"""

import subprocess
import sys
import time
import os

def main():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    print("=" * 60)
    print("☕ Starting Cafe Companion Ecosystem...")
    print("=" * 60)

    processes = []
    try:
        # 1. Start Python AI Backend
        print("[1/3] Launching Python FastAPI AI Engine on http://localhost:8000 ...")
        ai_cmd = [sys.executable, "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
        p_ai = subprocess.Popen(ai_cmd, cwd=os.path.join(base_dir, "backend-ai"))
        processes.append(("FastAPI AI Engine", p_ai))

        # 2. Start Express Realtime Gateway
        print("[2/3] Launching Express Realtime Gateway on http://localhost:5000 ...")
        realtime_cmd = ["npx", "ts-node", "src/server.ts"]
        p_rt = subprocess.Popen(realtime_cmd, cwd=os.path.join(base_dir, "backend-realtime"), shell=True)
        processes.append(("Express Gateway", p_rt))

        # 3. Start Vite React Frontend
        print("[3/3] Launching React Frontend on http://localhost:5173 ...")
        frontend_cmd = ["npm", "run", "dev"]
        p_fe = subprocess.Popen(frontend_cmd, cwd=os.path.join(base_dir, "frontend"), shell=True)
        processes.append(("Vite React Frontend", p_fe))

        print("\n✨ All services successfully launched!")
        print("👉 Frontend:         http://localhost:5173")
        print("👉 AI Backend (Docs): http://localhost:8000/docs")
        print("👉 Real-time Gateway: http://localhost:5000/health")
        print("\nPress Ctrl+C to terminate all processes.\n")

        while True:
            time.sleep(1)

    except KeyboardInterrupt:
        print("\n🛑 Shutting down Cafe Companion services...")
        for name, proc in processes:
            print(f"Terminating {name}...")
            proc.terminate()
        sys.exit(0)

if __name__ == "__main__":
    main()
