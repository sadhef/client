const { spawn } = require('child_process');
const path = require('path');
const kill = require('tree-kill');

class DashService {
  constructor() {
    this.dashProcess = null;
    this.isRunning = false;
  }

  start() {
    return new Promise((resolve, reject) => {
      if (this.isRunning) {
        return resolve('Dash server is already running');
      }

      const dashPath = path.join(__dirname, '../../engine_analyzer_dash/dashboard');
      const pythonPath = process.env.PYTHON_PATH || 'python';

      this.dashProcess = spawn(pythonPath, ['-m', 'flask', 'run', '--port=8050'], {
        cwd: dashPath,
        env: {
          ...process.env,
          FLASK_APP: '__init__.py',
          FLASK_ENV: 'development',
          PYTHONPATH: process.env.PYTHONPATH || '/app:/app/bladerunner'
        }
      });

      this.dashProcess.stdout.on('data', (data) => {
        console.log(`Dash stdout: ${data}`);
        if (data.includes('Running on')) {
          this.isRunning = true;
          resolve('Dash server started successfully');
        }
      });

      this.dashProcess.stderr.on('data', (data) => {
        console.error(`Dash stderr: ${data}`);
      });

      this.dashProcess.on('error', (error) => {
        console.error('Failed to start Dash server:', error);
        this.isRunning = false;
        reject(error);
      });

      this.dashProcess.on('close', (code) => {
        console.log(`Dash server process exited with code ${code}`);
        this.isRunning = false;
      });

      // Set timeout for startup
      setTimeout(() => {
        if (!this.isRunning) {
          reject(new Error('Dash server failed to start within timeout'));
        }
      }, 10000);
    });
  }

  stop() {
    return new Promise((resolve) => {
      if (this.dashProcess && this.isRunning) {
        kill(this.dashProcess.pid, 'SIGTERM', (err) => {
          if (err) {
            console.error('Error stopping Dash server:', err);
          }
          this.isRunning = false;
          this.dashProcess = null;
          resolve('Dash server stopped');
        });
      } else {
        resolve('Dash server is not running');
      }
    });
  }

  isServerRunning() {
    return this.isRunning;
  }
}

module.exports = new DashService();