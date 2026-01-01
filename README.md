# AxleMetrics - Pavement Traffic Load & ESAL Analysis

AxleMetrics is a comprehensive web application designed for civil engineers and pavement designers to calculate Equivalent Axle Load Factors (EALF) and Design Equivalent Single Axle Loads (ESALs). The application provides accurate, AASHTO-standard calculations for both flexible and rigid pavement designs.

## Features

### 🛣️ Core Calculators

- **EALF Calculator**: Calculate Equivalent Axle Load Factors using both Simplified and AASHTO methods.
     - Supports Flexible (Asphalt) and Rigid (Concrete) pavement types.
- **Truck Factor Calculation**: Determine ESAL factors based on axle load distribution.
- **Design ESALs**: Calculate total design ESALs over a design period.

### 📊 Reporting & Analysis

- **PDF Reports**: Generate detailed reports of your calculations (Original & Simplified AASHO ESAL Reports).
- **Templates**: Downloadable Excel/CSV templates for axle data input.
- **Dashboard**: Centralized hub to access all calculation tools.

### 🔐 Authentication & Security

- Secure user authentication system.
- Support for Individual and Company accounts.
- Features include Login, Sign up, Forgot Password, and OTP Verification.
- Protected routes ensuring data security.

## Technology Stack

- **Frontend Framework**: [React](https://reactjs.org/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Data Parsing**: [PapaParse](https://www.papaparse.com/) (CSV)

## Getting Started

Follow these steps to set up the project locally on your machine.

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18+ recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**

      ```bash
      git clone <repository-url>
      cd AxleMetrics
      ```

2. **Install dependencies**
      ```bash
      npm install
      ```

### Running the Application

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:1420`.

### Building Desktop version

This tool uses [tauri](https://tauri.app), a rust framework for building desktop application, to build the desktop version. Please follow the steps to install and build the desktop version.

1. **Install dependencies**
      - First install the rust toolchain from [rustup](https://rustup.rs) and follow the instructions
      - Install the following rust dependencies for building for both linux and Windows

      ```bash
      rustup target add x86_64-pc-windows-msvc 	 	# Toolchain for building for Windows targets
      rustup target add x86_64-unknown-linux-gnu 	# Toolchain for building for Linux targets
      cargo install --locked cargo-xwin      	 	# For building Windows executables
      ```

2. **Build the desktop version**
   If all dependencies are installed run this command to build for Windows target
      ```bash
       npm run tauri build -- --runner cargo-xwin --target x86_64-pc-windows-msvc --no-bundle 
      ```
      For linux target
      ```bash
      npm run tauri build --target x86_64-unknown-linux-gnu --no-bundle
      ```

## Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the application for production.
- `npm run preview`: Previews the production build locally.
- `npm run lint`: Runs ESLint to check for code quality issues.

## Project Structure

```
src/
├── components/      # Reusable UI components and Feature specific components
├── context/         # React Context (AuthContext, etc.)
├── services/        # API and Authentication services
├── types/           # TypeScript type definitions
├── utils/           # Helper functions and calculation logic
├── App.tsx          # Main application component with Routing
└── main.tsx         # Application entry point

src-tauri
├── build.rs				# Build Script for rust backend
├── capabilities
│   └── default.json
├── Cargo.toml
├── gen
│   └── schemas
│       ├── acl-manifests.json
│       ├── capabilities.json
│       ├── desktop-schema.json
│       └── linux-schema.json
├── icons				# Icons of different sizes 
│   ├── 128x128@2x.png
│   ├── 128x128.png
│   ├── 32x32.png
│   ├── icon.icns
│   ├── icon.ico
│   ├── icon.png
│   ├── Square107x107Logo.png
│   ├── Square142x142Logo.png
│   ├── Square150x150Logo.png
│   ├── Square284x284Logo.png
│   ├── Square30x30Logo.png
│   ├── Square310x310Logo.png
│   ├── Square44x44Logo.png
│   ├── Square71x71Logo.png
│   ├── Square89x89Logo.png
│   └── StoreLogo.png
├── src					# Backend code for system related tasks
│   ├── lib.rs
│   └── main.rs
└── tauri.conf.json			# Tauri configuration file
```

## detailed Calculation Methods

- **AASHTO 1993 Original Equations**: Uses the standard equations for flexible and rigid pavements.
- **AASHTO 1993 Simplified Method**: Provides quick estimates for preliminary design.

---

© 2024 AxleMetrics. All rights reserved.
