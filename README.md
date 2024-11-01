# GeoGebra for Figma - Main Thread

This repository contains the main thread code for the [GeoGebra for Figma](https://www.figma.com/community/plugin/1163446140410056847/geogebra-for-figma) plugin, which enables function graph creation and editing directly within Figma.

For the full project, including the user interface and setup instructions, please visit the primary [UI repository here](https://github.com/karutt/geogebra-for-figma).

## Overview

The main thread code handles Figma's scene and data operations, processing function graphs created through the UI. This portion of the plugin operates in the background, interacting with the Figma document structure and handling updates to graphs.

## Development Setup

To set up the main thread for local development, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/karutt/geogebra-for-figma-main-thread.git
   ```

2. Install dependencies and start the development server:

   ```bash
   npm install
   npm run dev
   ```

3. Adjust the `.src/canvas.ts` file for local development, if necessary, by following the instructions in the [UI repository's README](https://github.com/karutt/geogebra-for-figma#development-setup-for-contributors).
