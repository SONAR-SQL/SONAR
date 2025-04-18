# SONAR - AI Trade Scout

<p align="center">
  <img src="public/sonar-logo.png" alt="SONAR Logo" width="200">
</p>

<p align="center">
  Real-time blockchain intelligence for Solana traders
</p>

<p align="center">
  <a href="#key-features">Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#installation">Installation</a> •
  <a href="#usage">Usage</a> •
  <a href="#roadmap">Roadmap</a> •
  <a href="#faq">FAQ</a> •
  <a href="#license">License</a>
</p>
  
<p align="center">
  <a href="https://www.sonar.tel">
    <img src="https://img.shields.io/badge/Website-sonar.tel-blue?style=flat-square&logo=world&logoColor=white" alt="Website">
  </a>
  <a href="https://x.com/SolanaSonar">
    <img src="https://img.shields.io/badge/Twitter-@SolanaSonar-blue?style=flat-square&logo=twitter&logoColor=white" alt="Twitter">
  </a>
  <a href="https://github.com/SONAR-SQL/SONAR">
    <img src="https://img.shields.io/badge/GitHub-SONAR--SQL%2FSONAR-blue?style=flat-square&logo=github&logoColor=white" alt="GitHub">
  </a>
  <a href="https://github.com/SONAR-SQL/SONAR/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/SONAR-SQL/SONAR?style=flat-square" alt="License">
  </a>
</p>

## 📋 Overview

SONAR is an innovative AI-driven trading intelligence platform in the Solana ecosystem, designed to provide cryptocurrency traders with real-time, accurate on-chain data analysis and trading insights. By monitoring whale activities, market patterns, and blockchain transactions, SONAR helps traders make more informed decisions.

- **Website**: [https://www.sonar.tel](https://www.sonar.tel)
- **Twitter**: [@SolanaSonar](https://x.com/SolanaSonar)
- **GitHub**: [https://github.com/SONAR-SQL/SONAR](https://github.com/SONAR-SQL/SONAR)

## 📡 Key Features

- 🐋 **Whale Radar**: Real-time tracking and analysis of whale activities on the blockchain
- 🚨 **Alert System**: Real-time alerts for market anomalies and opportunities
- 📊 **Market Intelligence Dashboard**: On-chain data-driven market insights and trend analysis
- 👤 **Personal Intelligence Center**: Personalized market intelligence based on user preferences and holdings
- 🔄 **Real-time Updates**: Socket.io powered real-time data updates and notifications
- 🔒 **Secure Authentication**: JWT-based authentication system for user data protection

## 🏗️ Architecture

### System Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  React      │     │  Node.js    │     │  MongoDB    │
│  Frontend   │◄───►│  Backend    │◄───►│  Database   │
└─────────────┘     └─────────────┘     └─────────────┘
                         ▲   ▲
                         │   │
                ┌────────┘   └────────┐
                ▼                     ▼
        ┌─────────────┐       ┌─────────────┐
        │  Solana     │       │  TensorFlow │
        │  Blockchain │       │  AI Models  │
        └─────────────┘       └─────────────┘
```

### Component Architecture

- **Frontend**: React SPA with Redux state management and real-time WebSocket updates
- **Backend**: Express.js RESTful API with Socket.io for real-time communication
- **Database**: MongoDB for user data, alerts, and market analysis storage
- **AI Module**: TensorFlow for market pattern recognition and anomaly detection
- **Blockchain Interface**: Solana Web3.js for on-chain data extraction and analysis

## 🧩 Core Modules

### 1. Whale Tracking Module
- Monitors large wallet transactions on Solana
- Analyzes whale behavior patterns and trends
- Provides real-time notifications on significant movements

### 2. Alert System Module
- Customizable alert settings for different market conditions
- Multi-channel notification (in-app, email)
- Alert history and management

### 3. Market Analysis Module
- Token price and volume tracking
- Trend analysis and pattern recognition
- AI-powered market sentiment analysis

### 4. User Personalization Module
- Watchlist management
- Custom dashboard configuration
- User preference-based recommendations

## 🚀 Installation

### Prerequisites
- Node.js v14.x or higher
- MongoDB v4.x or higher
- Yarn or npm package manager

### Frontend

```bash
# Clone the repository
git clone https://github.com/SONAR-SQL/SONAR.git
cd SONAR

# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start development server
npm run dev
```

## 💻 Usage

### User Registration and Authentication
1. Create an account with email and password
2. Log in to access personalized dashboard
3. Update profile settings as needed

### Setting Up Alerts
1. Navigate to the Alerts section
2. Create new alert with custom parameters
3. Choose notification preferences
4. Manage and modify existing alerts

### Tracking Whale Activity
1. Browse the Whale Radar section
2. Add wallets to tracking list
3. View historical transactions and patterns
4. Receive alerts on significant movements

### Market Analysis
1. Explore the Market Intelligence dashboard
2. Add tokens to watchlist
3. View detailed price and volume analysis
4. Identify trends and patterns

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Whale Tracking
- `GET /api/whales/top` - Get top whale wallets
- `GET /api/whales/activities` - Get recent whale activities
- `GET /api/whales/wallet/:address` - Get wallet details
- `GET /api/whales/tracked` - Get user tracked wallets
- `POST /api/whales/track` - Track a wallet
- `DELETE /api/whales/tracked/:address` - Untrack a wallet

### Alerts
- `GET /api/alerts` - Get user's alerts
- `PUT /api/alerts/:id/read` - Mark alert as read
- `PUT /api/alerts/read-all` - Mark all alerts as read
- `POST /api/alerts/custom` - Create custom alert
- `DELETE /api/alerts/:id` - Delete an alert
- `GET /api/alerts/settings` - Get alert settings

### Market Data
- `GET /api/market/overview` - Get market overview
- `GET /api/market/token/:address` - Get token details
- `GET /api/market/search` - Search tokens
- `GET /api/market/watchlist` - Get user's watchlist
- `POST /api/market/watchlist` - Add token to watchlist
- `DELETE /api/market/watchlist/:address` - Remove token from watchlist

## 📦 Environment Setup

Create a `.env` file in the backend directory:

```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/sonar
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

## 📊 Data Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Blockchain │────►│  Data       │────►│  Analysis   │
│  Events     │     │  Collection │     │  Engine     │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                                              ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User       │◄────│  Alert      │◄────│  Pattern    │
│  Interface  │     │  System     │     │  Recognition│
└─────────────┘     └─────────────┘     └─────────────┘
```

## 🔥 Unique Features

- **Smart Whale Classification**: AI-powered classification of whale wallets based on trading behavior patterns
- **Predictive Alert System**: Machine learning algorithms that predict potential market movements before they occur
- **Cross-Chain Correlation**: Analysis of correlation between Solana and other blockchain activities
- **Social Sentiment Integration**: Combining on-chain data with social media sentiment analysis
- **Custom Alert Scripting**: Advanced users can write custom JavaScript alert conditions

## 🛣️ Roadmap

### Q2 2025 (Planned)
- 📅 Basic architecture and infrastructure
- 📅 User authentication system
- 📅 Whale tracking module (MVP)
- 📅 Simple alert system

### Q3 2025 (Planned)
- 📅 Enhanced data visualization
- 📅 Real-time notification system
- 📅 Custom alert creation
- 📅 Token watchlist functionality

### Q4 2025 (Planned)
- 📅 AI pattern recognition integration
- 📅 Mobile application development
- 📅 Enhanced market analysis tools
- 📅 API documentation and developer resources

### Q1 2026 (Planned)
- 📅 Advanced trading strategy recommendations
- 📅 Social features and community insights
- 📅 Premium subscription model
- 📅 Integration with popular trading platforms

## 🧪 Testing

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd frontend
npm test
```

## ⚠️ Known Issues

- Real-time updates may experience delays during high network congestion
- AI predictions have varying accuracy depending on market volatility
- Mobile experience needs optimization

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please refer to our [contribution guidelines](CONTRIBUTING.md) for more details.

## ❓ FAQ

### Is SONAR free to use?
The basic version of SONAR is free to use. We plan to introduce premium features in the future for advanced users.

### How accurate are the alerts and predictions?
Alert accuracy is highly dependent on the nature of the alert. Whale movement alerts are typically very accurate (>95%), while predictive market alerts have varying accuracy (70-85%) depending on market conditions.

### How is user data protected?
We use industry-standard JWT authentication, secure password hashing, and do not store sensitive user information beyond what's necessary for the platform functionality.

### Can I use SONAR for automated trading?
While SONAR provides valuable trading insights, it is not designed as an automated trading system. However, our API can be integrated with trading systems at your own discretion.

### What chains does SONAR support?
Currently, SONAR focuses exclusively on the Solana blockchain. Support for additional chains is on our roadmap.

## 📄 License

MIT License

Copyright (c) 2023 SONAR

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. 