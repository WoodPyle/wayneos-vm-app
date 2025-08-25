#!/bin/bash

# Git Signing Setup Script for WayneOS
# This configures SSH-based commit signing for authorship verification

echo "🔐 WayneOS Git Signing Setup"
echo "============================"
echo ""

# Check if SSH key exists
if [ ! -f ~/.ssh/id_ed25519 ]; then
    echo "📝 Creating new SSH signing key..."
    ssh-keygen -t ed25519 -C "bbob commit signing" -f ~/.ssh/id_ed25519
fi

echo ""
echo "🔑 Your SSH public key for GitHub:"
echo "=================================="
cat ~/.ssh/id_ed25519.pub
echo "=================================="
echo ""
echo "👆 Add this key to GitHub → Settings → SSH and GPG keys"
echo "   Select 'Signing Key' as the key type"
echo ""
echo "Press Enter when you've added the key to GitHub..."
read

# Configure Git for SSH signing
echo "⚙️  Configuring Git for SSH signing..."

git config --global user.name "Benny Wayne"
git config --global user.email "bw@wayneia.com"
git config --global commit.gpgsign true
git config --global gpg.format ssh
git config --global user.signingkey ~/.ssh/id_ed25519.pub

# Configure for this repository specifically
cd /home/bbob/wayne-OS/wayneos-vm-app
git config commit.gpgsign true
git config gpg.format ssh
git config user.signingkey ~/.ssh/id_ed25519.pub

echo ""
echo "✅ Git signing configured!"
echo ""
echo "📋 Next steps:"
echo "1. Initialize the Git repository:"
echo "   git init"
echo "   git add ."
echo "   git commit -S -m 'Initial commit: WayneOS AI-Native Operating System'"
echo ""
echo "2. Create GitHub repository at https://github.com/new"
echo "   Repository name: wayneos-vm-app"
echo "   Description: AI-Native Operating System - 313,150 ops/sec"
echo "   Visibility: Public (for demo) or Private"
echo ""
echo "3. Push to GitHub:"
echo "   git remote add origin git@github.com:bbobwayne/wayneos-vm-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Enable GitHub Pages:"
echo "   Repository → Settings → Pages → Source: GitHub Actions"
echo ""
echo "5. Create a signed release:"
echo "   git tag -s v1.0.0 -m 'Release v1.0.0: Initial release'"
echo "   git push --tags"
echo ""
echo "Your commits will now show as 'Verified' on GitHub! 🎉"