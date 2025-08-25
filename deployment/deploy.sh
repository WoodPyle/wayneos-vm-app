#!/bin/bash

# WayneOS Cloud Run Deployment Script
# This script deploys all 5 WayneOS distributions to Google Cloud Run

set -e

PROJECT_ID="wayne-ia-investment-platform"
REGION="us-central1"
ARTIFACT_REGISTRY="wayneos"

echo "🚀 WayneOS Cloud Run Deployment"
echo "================================"

# Check if gcloud is configured
if ! gcloud config get-value project &> /dev/null; then
    echo "❌ Error: gcloud is not configured"
    echo "Run: gcloud config set project $PROJECT_ID"
    exit 1
fi

# Enable required APIs
echo "📦 Enabling required APIs..."
gcloud services enable \
    run.googleapis.com \
    cloudbuild.googleapis.com \
    artifactregistry.googleapis.com \
    containerregistry.googleapis.com

# Create Artifact Registry repository if it doesn't exist
echo "📦 Creating Artifact Registry repository..."
gcloud artifacts repositories create $ARTIFACT_REGISTRY \
    --repository-format=docker \
    --location=$REGION \
    --description="WayneOS container images" || true

# Build and push container
echo "🔨 Building container image..."
gcloud builds submit \
    --config=deployment/cloudbuild.yaml \
    --substitutions=SHORT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest") \
    .

echo "✅ Deployment complete!"
echo ""
echo "Access your WayneOS distributions at:"
echo "- Base: https://wayneos-base-916492088270.us-central1.run.app"
echo "- TOP: https://wayneos-top-916492088270.us-central1.run.app"
echo "- SSPB: https://wayneos-sspb-916492088270.us-central1.run.app"
echo "- Financial: https://wayneos-financial-916492088270.us-central1.run.app"
echo "- Enterprise: https://wayneos-enterprise-916492088270.us-central1.run.app"