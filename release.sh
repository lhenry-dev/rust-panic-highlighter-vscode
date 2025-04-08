#!/bin/bash

# Check if we're on the main branch
BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$BRANCH" != "main" ]; then
  echo "You must be on the main branch to release."
  exit 1
fi

# Check if there are uncommitted changes
if [[ -n $(git status --porcelain) ]]; then
  echo "There are uncommitted changes. Please commit or stash them before proceeding."
  exit 1
fi

# Check if the version bump type parameter is passed and is valid (patch, minor, major)
if [ -z "$1" ]; then
  echo "You must specify the version bump type (patch, minor, or major)."
  exit 1
fi

if [[ "$1" != "patch" && "$1" != "minor" && "$1" != "major" ]]; then
  echo "Invalid version bump type. Valid options are: patch, minor, major."
  exit 1
fi

# 1. Bump the version in package.json based on the passed parameter
echo "Bumping version ($1)..."
npm version $1 -m "Release version %s"

# 2. Publish the extension with VSCE
echo "Publishing the extension..."
vsce publish --version $(node -p "require('./package.json').version")

# 3. Create a git tag for the new version
VERSION=$(node -p "require('./package.json').version")
echo "Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "Release version $VERSION"

# 4. Commit and push changes to the main branch
echo "Committing and pushing changes..."
git push origin main
git push origin "v$VERSION"

echo "Release complete!"
