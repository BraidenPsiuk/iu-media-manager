<h1><img src="https://user-images.githubusercontent.com/33185352/75599212-b94eaf00-5a70-11ea-8a05-4ec05736832b.png" alt="InnerView Logo" width="26px" height="26px"/> InnerView Ultrasound Media Manager</h1>
Allows easy video recording using OBS and manages video/image uploads to Dropbox

## Getting started
1. Make sure you have a recent copy of Node.js. [**Node version 12.20.1**](https://nodejs.org/download/release/v12.20.1/) was used during development. *An equal or higher version will most likely work.*
2. Clone the project:
```bash
git clone https://github.com/Braiden-Psiuk/iu-media-manager.git
```
3. navigate to the project directory, install dependencies, and start a development server:
- Installation:
  ```bash
  cd iu-media-manager
  npm i
  ```
- Development (starting up):
  ```bash
  npm start & sleep 5 && npm run start-electron &
  ```
- Development (shutting down):
  ```bash
  killall node && reset
  ```
- Packaging for Mac:
  ```bash
  npm run build && npm run build-electron && npm run package-mac
  ```

## To Do
- Create some new test scripts, or add existing ones to a folder to organize them a bit
- Test building the project for Windows 7 on an old I5 machine, Windows 8, OSX, and Ubuntu
- Create 'preferences' pane to set DBX key
- Upgrade "typeface-roboto" solution to something newer, as this is now deprecated
- Add app screenshots to the readme
