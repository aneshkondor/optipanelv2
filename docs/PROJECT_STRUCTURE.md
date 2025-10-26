# Project Structure

```
calhacks/
├── src/
│   ├── config/
│   │   └── vapi.config.js          # Vapi configuration and settings
│   ├── services/
│   │   ├── dataAnalyzer.js         # Analyzes engagement data for drops
│   │   ├── engagementMonitor.js    # Main monitoring service
│   │   └── vapiService.js          # Vapi API integration
│   └── index.js                    # Express server & API endpoints
│
├── examples/
│   ├── usage-example.js            # JavaScript usage examples
│   └── api-usage.sh                # curl API examples
│
├── .env.example                    # Environment variables template
├── .gitignore                      # Git ignore rules
├── package.json                    # Dependencies and scripts
├── README.md                       # Full documentation
├── QUICKSTART.md                   # 5-minute setup guide
├── PROJECT_STRUCTURE.md            # This file
└── test-quick.js                   # Quick system test
```

## Core Components

### 1. Data Analyzer (`src/services/dataAnalyzer.js`)

**Purpose**: Analyzes user engagement data to detect drops and patterns

**Key Methods**:
- `analyzeEngagement(dataPoints)` - Detects engagement drops
- `calculateTrend(dataPoints)` - Identifies trends (declining/improving/stable)
- `detectPatterns(dataPoints)` - Finds sudden drops and consecutive declines

**Input**:
```javascript
[
  { timestamp: "2024-01-01T10:00:00Z", value: 85 },
  { timestamp: "2024-01-02T10:00:00Z", value: 50 }
]
```

**Output**:
```javascript
{
  hasDropped: true,
  dropPercentage: 41.2,
  baseline: 85,
  recentAverage: 50,
  trend: "declining"
}
```

### 2. Vapi Service (`src/services/vapiService.js`)

**Purpose**: Handles all Vapi API interactions for voice calls

**Key Methods**:
- `createAssistant(customScript)` - Creates AI assistant configuration
- `makeCall(callParams)` - Initiates outbound call
- `getCall(callId)` - Retrieves call details
- `generateScript(userData, analysisData)` - Creates dynamic call scripts

**Features**:
- Dynamic script generation based on engagement data
- Call recording and transcription
- Metadata tracking for analytics

### 3. Engagement Monitor (`src/services/engagementMonitor.js`)

**Purpose**: Orchestrates the entire monitoring and calling workflow

**Key Methods**:
- `addUser(user)` - Add user to monitoring system
- `updateUserEngagement(userId, dataPoint)` - Update engagement data
- `checkUser(userId)` - Analyze user and trigger call if needed
- `startMonitoring(intervalMs)` - Start automatic periodic checks
- `getStats()` - Get monitoring statistics

**Workflow**:
1. Maintains list of monitored users
2. Periodically checks each user's engagement
3. Triggers calls when drops detected
4. Enforces cooldown periods (48h default)
5. Tracks call history

### 4. Express Server (`src/index.js`)

**Purpose**: REST API for integration and monitoring

**Endpoints**:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| GET | `/api/stats` | Monitoring statistics |
| POST | `/api/users` | Add user to monitoring |
| POST | `/api/users/:userId/engagement` | Update engagement data |
| POST | `/api/users/:userId/check` | Manually check user |
| GET | `/api/users/:userId/calls` | Get call history |
| POST | `/api/monitoring/start` | Start monitoring |
| POST | `/api/monitoring/stop` | Stop monitoring |
| POST | `/api/webhooks/vapi` | Vapi webhook events |
| GET | `/api/calls/:callId` | Get call details |

## Data Flow

```
User Activity → Your Analytics System
                      ↓
                POST /api/users/:userId/engagement
                      ↓
              Engagement Monitor
                      ↓
              Data Analyzer
                      ↓
            Drop Detected? ──No──→ Continue monitoring
                  ↓ Yes
            Generate Script
                  ↓
            Vapi Service
                  ↓
            Make Phone Call
                  ↓
            Record in History
                  ↓
            Webhook Events ←─── Vapi
                  ↓
            Your webhook handler
```

## Configuration Files

### `.env`
Environment-specific configuration:
- API keys and secrets
- Server settings
- Engagement thresholds
- Company information

### `src/config/vapi.config.js`
Vapi-specific configuration:
- Assistant behavior
- Voice settings
- Model parameters
- System prompts

## Key Design Decisions

### 1. Engagement Data Structure
- **Timestamps**: ISO 8601 format for consistency
- **Values**: Numeric scores (0-100 recommended)
- **Metrics**: Flexible metric types for different data sources

### 2. Drop Detection Algorithm
- **Baseline**: Average of first half of data points
- **Recent**: Average of last 3 data points
- **Threshold**: Configurable percentage (default: 30%)

### 3. Call Cooldown
- **Default**: 48 hours between calls to same user
- **Reason**: Avoid annoying users with frequent calls
- **Configurable**: Can be adjusted per use case

### 4. Script Customization
- **Dynamic**: Scripts generated based on actual data
- **Personalized**: Uses user name and specific metrics
- **Adaptive**: Different messages for different drop severities

## Extension Points

Want to customize? Here's what you can modify:

### Add New Engagement Metrics
Edit `DataAnalyzer.analyzeEngagement()` to support new metric types

### Custom Call Logic
Modify `EngagementMonitor.checkUser()` to add custom triggering rules

### Different Voice Providers
Change `vapiConfig.assistant.voice.provider` to use different TTS

### Advanced Analytics
Extend `DataAnalyzer.detectPatterns()` with ML models

### Multi-language Support
Modify `generateScript()` to support different languages

### CRM Integration
Add methods to sync with Salesforce, HubSpot, etc.

## Testing Strategy

### Unit Tests
Test individual components:
```bash
node -e "import('./src/services/dataAnalyzer.js').then(m => {...})"
```

### Integration Tests
Test full workflow:
```bash
node examples/usage-example.js
```

### API Tests
Test endpoints:
```bash
./examples/api-usage.sh
```

### Quick Sanity Check
```bash
node test-quick.js
```

## Deployment

### Local Development
```bash
npm run dev
```

### Production
```bash
npm start
```

### Docker (Optional)
```dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
CMD ["npm", "start"]
```

### Environment Variables for Production
- Set `NODE_ENV=production`
- Use secure API keys
- Configure proper logging
- Set up monitoring/alerting

## Performance Considerations

### Memory
- Data is kept in-memory (Map objects)
- For large scale, consider Redis or database

### Scalability
- Current design: Single server
- For scale: Add queue (Bull, BullMQ) for call processing

### Rate Limiting
- Vapi has API rate limits
- Add rate limiting middleware for your API

### Data Retention
- Currently keeps all engagement data
- Add cleanup for old data (>30 days)

## Security Notes

- **API Keys**: Never commit `.env` to git
- **Phone Numbers**: Validate format before calling
- **Webhooks**: Verify Vapi webhook signatures
- **User Data**: Consider GDPR/privacy regulations
- **Rate Limiting**: Prevent abuse of API endpoints

## Troubleshooting

See the main [README.md](README.md) for detailed troubleshooting guide.

## Contributing

To add features:
1. Create new service in `src/services/`
2. Import in `src/index.js`
3. Add API endpoints
4. Update documentation
5. Add examples

## License

MIT
