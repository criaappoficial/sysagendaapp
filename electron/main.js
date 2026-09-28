const { app, BrowserWindow } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const http = require('http');

let mainWindow;
let nextProcess;

async function getFreePort() {
  return new Promise((resolve) => {
    const server = http.createServer();
    server.listen(0, () => {
      const port = server.address().port;
      server.close(() => resolve(port));
    });
  });
}

function waitForServer(url, timeout = 30000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const check = () => {
      http.get(url, (res) => {
        if (res.statusCode === 200 || res.statusCode === 404) {
          resolve();
        } else {
          retry();
        }
      }).on('error', retry);
    };

    const retry = () => {
      if (Date.now() - start > timeout) {
        reject(new Error('Timeout waiting for Next.js server'));
      } else {
        setTimeout(check, 500);
      }
    };

    check();
  });
}

async function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: 'SysAgenda',
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  const port = await getFreePort();
  
  // No Electron, salvamos o banco numa pasta de dados do usuário segura (pois a pasta de instalação do app é read-only)
  const userDataPath = app.getPath('userData');
  const dbPath = path.join(userDataPath, 'sysagenda.db');
  
  const fs = require('fs');
  // Se for o primeiro acesso no modo empacotado e o banco não existir, copia o banco vazio/atual
  if (!fs.existsSync(dbPath)) {
    const defaultDbPath = app.isPackaged 
      ? path.join(process.resourcesPath, 'database', 'meetings.db')
      : path.join(__dirname, '..', 'database', 'meetings.db');
      
    if (fs.existsSync(defaultDbPath)) {
      try {
        fs.copyFileSync(defaultDbPath, dbPath);
        console.log('Database copiado para:', dbPath);
      } catch (e) {
        console.error('Erro ao copiar database:', e);
      }
    }
  }

  const databaseUrl = `file:${dbPath}`;
  
  console.log('Database URL:', databaseUrl);
  
  const env = {
    ...process.env,
    PORT: port,
    DATABASE_URL: databaseUrl,
    NODE_ENV: 'production'
  };

  const isPackaged = app.isPackaged;
  
  if (isPackaged) {
    // Modo empacotado: iniciar o standalone do Next.js usando o binário do Node.js embutido no Electron
    const serverPath = path.join(process.resourcesPath, '.next', 'standalone', 'server.js');
    
    // Inicia o processo passando ELECTRON_RUN_AS_NODE=1 para usar o Electron apenas como Node.js
    nextProcess = spawn(process.execPath, [serverPath], {
      env: { ...env, ELECTRON_RUN_AS_NODE: '1' }
    });
    
    nextProcess.stdout.on('data', (data) => console.log(`Next.js: ${data}`));
    nextProcess.stderr.on('data', (data) => console.error(`Next.js Error: ${data}`));
    
    await waitForServer(`http://localhost:${port}`);
    mainWindow.loadURL(`http://localhost:${port}`);
  } else {
    // Em desenvolvimento, o next dev roda por fora e usamos a porta 3000
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('quit', () => {
  if (nextProcess) {
    nextProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
