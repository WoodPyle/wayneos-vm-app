# WayneOS VM Application

## AI-Native Operating System - 313,150 ops/sec

WayneOS is the world's first AI-native operating system where natural language is the primary interface. No clicking icons - just tell Claude what you want to do.

## Features

- **Natural Language Control**: "Read my emails and create a task list"
- **Dynamic Hardware Optimization**: Automatically configures for work vs gaming
- **313,150 ops/sec Performance**: Industry-leading processing speed
- **5 Specialized Distributions**: Tailored for different industries
- **Claude Code Terminal**: Integrated AI assistant as your command line

## Distributions

1. **WayneOS Base** - Full AI-native OS experience with all 16 agents
2. **TOP Automotive** - TanOak franchise management (11 specialized agents)
3. **SS-PB Healthcare** - Healthcare staffing platform (6 HIPAA-compliant agents)
4. **Financial Modeling** - Reconciliation & analysis (8 financial agents)
5. **Enterprise Edition** - Full business transformation suite

## Quick Start

### Web Access (Recommended)

Visit one of our deployed distributions:
- Base: https://wayneos-base.run.app
- TOP: https://wayneos-top.run.app
- SSPB: https://wayneos-sspb.run.app
- Financial: https://wayneos-financial.run.app
- Enterprise: https://wayneos-enterprise.run.app

### Desktop Application

Download pre-built binaries from [releases](https://github.com/wayneia/wayneos/releases):
- Windows: `WayneOS-{distribution}-Setup.exe`
- macOS: `WayneOS-{distribution}.dmg`
- Linux: `WayneOS-{distribution}.AppImage`

### Development Setup

```bash
# Clone the repository
git clone https://github.com/wayneia/wayneos.git
cd wayneos

# Install dependencies
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
cd desktop-app && npm install && cd ..

# Set up environment variables
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
# Edit .env files with your Firebase and Claude API credentials

# Start development servers
cd backend && npm run dev &
cd frontend && npm run dev &

# Access at http://localhost:3000
```

## Architecture

```
┌─────────────────────────────────────────┐
│          React Frontend (TypeScript)     │
│  - Xterm.js terminal                    │
│  - Firebase authentication              │
│  - Real-time WebSocket                  │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│          Node.js Backend (Express)       │
│  - Socket.IO for real-time              │
│  - Claude API integration               │
│  - VM management                        │
└─────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────┐
│       Python Kernel Bridge               │
│  - 16 specialized AI agents             │
│  - Natural language processing          │
│  - System orchestration                 │
└─────────────────────────────────────────┘
```

## Natural Language Examples

```bash
# Email and task management
wayneos> Read my work and personal emails, create a task list for today

# Application control
wayneos> Open Firefox and go to wayneia.com

# Hardware optimization
wayneos> Optimize my PC for gaming from 9-11 PM

# File operations
wayneos> Create a new Python file for data analysis

# System information
wayneos> Show me system performance metrics
```

## Deployment

### Google Cloud Run

```bash
# Deploy all distributions
./deployment/deploy.sh

# Or deploy individually
gcloud run deploy wayneos-base \
  --source . \
  --region us-central1 \
  --set-env-vars DISTRIBUTION=wayneos
```

### Building Binaries

```bash
# Build desktop apps for all platforms
./build-binaries.sh

# Binaries will be in distributions/{distribution}/
```

## Development

### Frontend (React + TypeScript)

- `frontend/src/components/ClaudeTerminal.tsx` - Terminal interface
- `frontend/src/pages/DesktopPage.tsx` - Main desktop environment
- `frontend/src/services/firebase.ts` - Authentication

### Backend (Node.js)

- `backend/src/services/claudeService.ts` - Claude API integration
- `backend/src/services/socketService.ts` - WebSocket handling
- `backend/src/routes/api.ts` - REST API endpoints

### Kernel (Python)

- `wayneos-kernel/kernel_bridge.py` - Main kernel bridge
- `wayneos-kernel/agents/` - AI agent implementations
- `wayneos-kernel/agents/orchestrator.py` - Command routing

## Performance

WayneOS achieves 313,150 ops/sec through:
- Parallel agent execution
- Optimized command routing
- Efficient memory management
- GPU/TPU acceleration support

## Security

- Firebase Authentication with MFA
- Role-based access control per distribution
- Encrypted communications (TLS/SSL)
- Isolated VM environments
- Regular security audits

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Provenance & Verification

**Who authored this?**  
Commits and tags are cryptographically **signed** by @bbobwayne. GitHub shows a **Verified** badge.

**How was this built?**  
See `.github/workflows/*.yml` for automated builds. Builds use Node v20 with locked dependencies (`package-lock.json`).

**What exactly was released?**  
Each release includes:
- `wayneos-web-<version>.tar.gz` (build artifact)
- `wayneos-web-<version>.sha256` (checksum)
- `wayneos-web-<version>.sig` (Sigstore signature)
- `wayneos-web-<version>.crt` (certificate)
- `sbom.json` (CycloneDX Software Bill of Materials)

**How do I verify?**
```bash
# Verify checksum
shasum -a 256 -c wayneos-web-<version>.sha256

# Verify signature (cosign)
cosign verify-blob \
  --signature wayneos-web-<version>.sig \
  --certificate wayneos-web-<version>.crt \
  --certificate-identity-regexp ".*" \
  --certificate-oidc-issuer https://token.actions.githubusercontent.com \
  wayneos-web-<version>.tar.gz
```

**Build Attestation**  
GitHub Actions automatically generates build provenance attestations for all releases.

## License

Proprietary - Wayne IA Partnership. See [LICENSE](LICENSE) for details.

## Support

- Documentation: https://docs.wayneos.ai
- Support: support@wayneos.ai
- Issues: https://github.com/wayneia/wayneos/issues

---

Built with ❤️ by Wayne IA - Building Tomorrow's Intelligence Today