# Lystly React Native App

A React Native application built with Expo SDK 52.

## Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

## Setup

1. Clone the repository:

```bash
git clone https://github.com/esuveyke/lystly-reactnative.git
cd lystly-reactnative
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

## Version Management

This project uses strict version management to ensure stability:

- Expo SDK: 52.0.36
- React Native: 0.76.7
- React: 18.3.1
- React Native Reanimated: 3.5.0

### Adding New Dependencies

When adding new dependencies:

1. Check compatibility with Expo SDK 52
2. Use exact versions when possible
3. Run `npm run check-deps` to verify compatibility
4. Update `dependencyRules` in package.json if needed

## Development Workflow

1. Create a new branch for features:

```bash
git checkout -b feature/your-feature-name
```

2. Make your changes and commit:

```bash
git add .
git commit -m "feat: your feature description"
```

3. Push changes:

```bash
git push origin feature/your-feature-name
```

4. Create a Pull Request on GitHub

## Troubleshooting

If you encounter dependency issues:

1. Clear the cache:

```bash
rm -rf node_modules/.cache
```

2. Remove node_modules and reinstall:

```bash
rm -rf node_modules
npm install
```

3. Check dependency rules:

```bash
npm run check-deps
```

## Project Structure

```
lystly-reactnative/
├── app/                 # Main application code
├── assets/             # Static assets
├── scripts/            # Utility scripts
├── app.tsx            # Root component
├── babel.config.js    # Babel configuration
└── package.json       # Project configuration
```

## Contributing

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Ensure all dependency checks pass

## License

[Your License Here]
