# Gapless Audio Application

This is a simple application demonstrating gapless audio playback in react native using react-native-audio-api.

# Project Structure

Project
├── assets
│ └── musics
│ ├── 01.flac
│ ├── 02.flac
│ └── ...
│
├── src
│ ├── app
│ │ ├── \_layout.tsx
│ │ └── index.tsx # Main screen
│ │
│ ├── audio
│ │ └── audioManager.ts # Handles audio playback logic
│ │
│ ├── components
│ │
│ ├── constants
│ │
│ ├── hooks
│ │ ├── use-audio-player.ts # Playback hook using AudioManager
│ │ ├── use-handle-queue.ts # Handles next/replay logic
│ │ ├── use-seek-music.ts # Audio seeking support
│ │ └── use-handle-repeat-mode.ts # Repeat mode handling
│ │
│ ├── store
│ │ ├── audioStore.ts # Global audio controls
│ │ ├── queue-store.ts # Queue management
│ │ └── player-bottom-sheet-store.ts# Bottom sheet state/actions
│ │
│ ├── services
│ │ └── audioLibrary.ts # Static track provider
│ │
│ ├── types
│ │
│ └── utils
│ ├── folder
│ └── nesting
│
├── app.json
└── package.json

# Starting the project

1.  Create a development build using the following command.

`eas build --platform android --profile development`

3.  Install the build on simulator or a device
4.  Run this command to start the local development server `npx expo start`
