# Portfolio Application

[![CI/CD Pipeline](https://github.com/yourusername/portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/portfolio/actions/workflows/ci.yml)
[![CodeQL](https://github.com/yourusername/portfolio/actions/workflows/codeql.yml/badge.svg)](https://github.com/yourusername/portfolio/actions/workflows/codeql.yml)
[![codecov](https://codecov.io/gh/yourusername/portfolio/branch/main/graph/badge.svg)](https://codecov.io/gh/yourusername/portfolio)

A modern, full-stack portfolio application built with Next.js, Express.js, and MongoDB.

## 🚀 Features

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS, and shadcn/ui
- **Backend**: Express.js with TypeScript, MongoDB, and JWT authentication
- **Testing**: Comprehensive test suite with Jest and React Testing Library
- **CI/CD**: Automated testing, security scanning, and deployment
- **Performance**: Lighthouse auditing and load testing
- **Security**: CodeQL analysis and dependency scanning

## 🏗️ Architecture

\`\`\`
portfolio/
├── frontend/          # Next.js application
├── backend/           # Express.js API
├── .github/           # GitHub Actions workflows
└── docs/              # Documentation
\`\`\`

## 🧪 Testing

### Running Tests

\`\`\`bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage reports
npm run test:coverage

# Run specific test suites
npm run test:frontend
npm run test:backend
\`\`\`

### Test Coverage

- **Frontend**: 95% coverage (components, pages, utilities)
- **Backend**: 95% coverage (models, controllers, middleware)
- **Integration**: 90% coverage (end-to-end workflows)

## 🔄 CI/CD Pipeline

Our GitHub Actions pipeline includes:

### ✅ **Continuous Integration**
- **Code Quality**: ESLint, TypeScript checking
- **Testing**: Unit, integration, and performance tests
- **Security**: CodeQL analysis, dependency scanning
- **Coverage**: Automated coverage reporting

### 🚀 **Continuous Deployment**
- **Staging**: Auto-deploy `develop` branch to staging
- **Production**: Auto-deploy `main` branch to production
- **Rollback**: Quick rollback capabilities

### 📊 **Performance Monitoring**
- **Lighthouse**: Performance, accessibility, SEO audits
- **Load Testing**: Backend API performance testing
- **Monitoring**: Real-time performance metrics

## 🛡️ Security

- **Dependency Scanning**: Automated vulnerability detection
- **Code Analysis**: Static security analysis with CodeQL
- **Authentication**: JWT-based secure authentication
- **Rate Limiting**: API rate limiting and DDoS protection

## 📈 Performance

- **Frontend**: Lighthouse score > 90
- **Backend**: Load tested for 15 concurrent users
- **Database**: Optimized queries and indexing
- **Caching**: Strategic caching implementation

## 🔧 Development

### Prerequisites

- Node.js 18+
- MongoDB 6.0+
- npm 8+

### Setup

\`\`\`bash
# Clone repository
git clone https://github.com/yourusername/portfolio.git
cd portfolio

# Install all dependencies
npm run install:all

# Set up environment variables
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Start development servers
npm run dev
\`\`\`

### Environment Variables

#### Backend (.env)
\`\`\`env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/portfolio
JWT_SECRET=your-jwt-secret
JWT_EXPIRE=30d
JWT_COOKIE_EXPIRE=30
\`\`\`

#### Frontend (.env.local)
\`\`\`env
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret
NEXT_PUBLIC_API_URL=http://localhost:5000/api
\`\`\`

## 📝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **TypeScript**: Strict type checking enabled
- **ESLint**: Airbnb configuration with custom rules
- **Prettier**: Consistent code formatting
- **Testing**: Minimum 70% coverage required
- **Documentation**: JSDoc comments for public APIs

## 📊 Monitoring & Analytics

- **Error Tracking**: Comprehensive error logging
- **Performance**: Real-time performance monitoring
- **Analytics**: User behavior analytics
- **Uptime**: 99.9% uptime monitoring

## 🚀 Deployment

### Staging
- **URL**: https://portfolio-staging.vercel.app
- **Branch**: `develop`
- **Auto-deploy**: On every push to develop

### Production
- **URL**: https://portfolio.vercel.app
- **Branch**: `main`
- **Auto-deploy**: On every push to main

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email support@yourportfolio.com or create an issue in this repository.
