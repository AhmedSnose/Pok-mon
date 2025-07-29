# Pokemon Explorer

A modern, responsive Pokemon application built with React, TypeScript, Redux Toolkit, and RTK Query. Explore Pokemon data with a beautiful interface, persistent favorites, and comprehensive search functionality.

## 🚀 Features

- **Browse Pokemon**: Paginated list of Pokemon with beautiful cards
- **Detailed Views**: Comprehensive Pokemon information including stats, abilities, and types
- **Search Functionality**: Search Pokemon by name or ID
- **Persistent Favorites**: Add Pokemon to your favorites list (stored locally)
- **View History**: Keep track of recently viewed Pokemon
- **Responsive Design**: Optimized for desktop and mobile devices
- **Dark/Light Mode**: Automatic theme switching based on system preferences
- **Type-safe**: Full TypeScript support throughout the application
- **Testing**: Comprehensive unit and integration tests with >60% coverage

## 🛠 Technology Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe JavaScript for better development experience
- **Redux Toolkit** - Simplified Redux state management
- **RTK Query** - Powerful data fetching and caching
- **Redux Persist** - Persistent state storage
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Shadcn/ui** - Beautiful, accessible UI components
- **Vitest** - Fast unit testing framework
- **Testing Library** - Simple and complete testing utilities

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)

## 🔧 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <YOUR_GIT_URL>
   cd pokemon-explorer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration** (Optional)
   
   Create a `.env` file in the root directory to customize the API base URL:
   ```env
   VITE_BASE_API_URL=https://pokeapi.co/api/v2
   ```
   
   If no environment variable is provided, the application will use the default PokeAPI URL. The app includes validation to ensure it doesn't crash with invalid URLs.

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser** and navigate to `http://localhost:8080`

## 🎮 Usage

### Browsing Pokemon
- The main page displays a paginated list of Pokemon
- Use the pagination controls at the bottom to navigate through pages
- Each Pokemon card shows basic information including image, name, types, height, and weight

### Searching Pokemon
- Use the search bar at the top to find specific Pokemon
- Search by Pokemon name (e.g., "pikachu") or ID number (e.g., "25")
- Press Enter or click the Search button to navigate to the Pokemon detail page

### Pokemon Details
- Click on any Pokemon card to view detailed information
- The detail page includes:
  - High-resolution Pokemon artwork
  - Basic stats (height, weight, base experience)
  - Type information with color-coded badges
  - Abilities (including hidden abilities)
  - Base stats with visual progress bars
  - Favorite and share functionality

### Favorites System
- Click the heart icon on any Pokemon card or detail page to add/remove favorites
- Favorites are automatically saved and persist between browser sessions
- Favorited Pokemon are indicated with a filled heart icon

### Navigation
- Use the "Back to List" button on detail pages to return to the main list
- The browser back/forward buttons work as expected
- Direct URLs can be shared and bookmarked

## 🧪 Testing

This project includes comprehensive testing with coverage requirements of at least 60%.

### Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Coverage

The test suite covers:
- **Component Testing**: All major components (PokemonList, PokemonDetail, PokemonCard)
- **State Management**: Redux slices and actions
- **Utility Functions**: Pokemon data transformation utilities
- **API Integration**: RTK Query service layer
- **Configuration**: Environment variable handling

### Test Structure

```
src/__tests__/
├── components/
│   ├── PokemonCard.test.tsx
│   ├── PokemonList.test.tsx
│   └── PokemonDetail.test.tsx
├── store/
│   └── pokemonSlice.test.ts
├── utils/
│   └── pokemon.test.ts
└── config/
    └── env.test.ts
```

## 📝 Available Scripts

```bash
# Development
npm run dev              # Start development server

# Building
npm run build           # Build for production
npm run build:dev       # Build in development mode
npm run preview         # Preview production build

# Testing
npm run test            # Run tests once
npm run test:watch      # Run tests in watch mode
npm run test:coverage   # Run tests with coverage report

# Code Quality
npm run lint            # Run ESLint
```

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── PokemonCard.tsx
│   ├── PokemonList.tsx
│   ├── PokemonDetail.tsx
│   └── ui/             # Shadcn UI components
├── pages/              # Page components
├── store/              # Redux store and slices
│   ├── index.ts
│   └── slices/
├── services/           # API services (RTK Query)
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── hooks/              # Custom React hooks
├── config/             # Configuration files
└── __tests__/          # Test files
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_BASE_API_URL` | Pokemon API base URL | `https://pokeapi.co/api/v2` |

### API Endpoints Used

- `GET /pokemon` - List of Pokemon (paginated)
- `GET /pokemon/{id}` - Pokemon details by ID
- `GET /pokemon/{name}` - Pokemon details by name

## 🎨 Design System

The application uses a custom Pokemon-themed design system with:

- **Primary Colors**: Pokemon Red (#DC2626)
- **Secondary Colors**: Electric Yellow (#FACC15)
- **Accent Colors**: Electric Blue (#2563EB)
- **Type Colors**: Specific colors for each Pokemon type
- **Responsive Breakpoints**: Mobile-first design approach
- **Dark/Light Themes**: Automatic switching based on system preference

## 🚀 Performance Features

- **Lazy Loading**: Images are loaded on demand
- **Caching**: RTK Query provides automatic caching of API responses
- **Persistence**: Redux Persist saves user preferences and favorites
- **Responsive Images**: Optimized image loading for different screen sizes
- **Code Splitting**: Automatic code splitting for optimal bundle sizes

## 🐛 Error Handling

The application includes comprehensive error handling:

- **Network Errors**: Graceful handling of API failures with user-friendly messages
- **Invalid URLs**: Automatic fallback to default API URL for invalid configurations
- **404 Errors**: Proper handling of non-existent Pokemon
- **Loading States**: Skeleton loaders and loading indicators
- **Fallback Images**: Placeholder images when Pokemon sprites are unavailable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [PokeAPI](https://pokeapi.co/) for providing the Pokemon data
- [Shadcn/ui](https://ui.shadcn.com/) for the beautiful component library
- [Lucide React](https://lucide.dev/) for the icon set
- The Pokemon Company for creating these amazing creatures

---

**Built with ❤️ for Pokemon fans and developers alike!**