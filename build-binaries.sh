#!/bin/bash

# WayneOS Binary Distribution Build Script
# Builds desktop applications for all platforms and distributions

set -e

echo "🚀 WayneOS Binary Distribution Builder"
echo "====================================="

# Build frontend first
echo "📦 Building frontend..."
cd frontend
npm install
npm run build
cd ..

# Copy frontend build to desktop app
echo "📦 Copying frontend to desktop app..."
rm -rf desktop-app/build
cp -r frontend/dist desktop-app/build

# Build desktop apps for each distribution
DISTRIBUTIONS=("wayneos" "wayneos-top" "wayneos-sspb" "wayneos-financial" "wayneos-enterprise")
DIST_NAMES=("Base" "TOP-Automotive" "SSPB-Healthcare" "Financial-Modeling" "Enterprise")

cd desktop-app
npm install

for i in "${!DISTRIBUTIONS[@]}"; do
    DIST="${DISTRIBUTIONS[$i]}"
    NAME="${DIST_NAMES[$i]}"
    
    echo ""
    echo "🔨 Building $NAME distribution..."
    
    # Update package.json with distribution-specific info
    node -e "
    const pkg = require('./package.json');
    pkg.name = 'wayneos-$DIST';
    pkg.productName = 'WayneOS $NAME';
    pkg.build.appId = 'com.wayneia.$DIST';
    require('fs').writeFileSync('./package.json', JSON.stringify(pkg, null, 2));
    "
    
    # Build for all platforms
    npm run dist:win
    npm run dist:mac
    npm run dist:linux
    
    # Create distribution directory
    mkdir -p ../distributions/$DIST
    mv dist/* ../distributions/$DIST/
done

cd ..

echo ""
echo "✅ Build complete!"
echo ""
echo "Binary distributions available in:"
for i in "${!DISTRIBUTIONS[@]}"; do
    DIST="${DISTRIBUTIONS[$i]}"
    NAME="${DIST_NAMES[$i]}"
    echo "- $NAME: distributions/$DIST/"
done

echo ""
echo "Files created:"
echo "- Windows: *.exe (installer)"
echo "- macOS: *.dmg (disk image)"
echo "- Linux: *.AppImage (portable)"