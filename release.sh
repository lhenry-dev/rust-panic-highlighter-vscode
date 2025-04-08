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

VERSION=$(node -p "require('./package.json').version")
PACKAGE_NAME=$(node -p "require('./package.json').name")

# 2. Create the /releases folder if it doesn't exist
echo "Creating releases folder if it doesn't exist..."
mkdir -p releases

# 3. Create the .vsix file and move it to the /releases folder
echo "Creating .vsix file..."
vsce package
mv "$PACKAGE_NAME-*.vsix" releases/  # This handles the version dynamically

# 4. Publish the extension with VSCE
echo "Publishing the extension..."
echo "Version: $VERSION"
vsce publish "$VERSION"

# 5. Create a git tag for the new version
echo "Creating tag v$VERSION..."
git tag -a "v$VERSION" -m "chore: Release $PACKAGE_NAME version $VERSION"

# 6. Stage the .vsix file for commit
echo "Adding the .vsix file to Git..."
git add releases/"$PACKAGE_NAME-*.vsix"

# 7. Commit the changes (including the .vsix file)
echo "Committing changes..."
git commit -m "chore: Add $PACKAGE_NAME-$VERSION .vsix file"

# 8. Push the commit and the tag
echo "Pushing changes..."
git push origin main
git push origin "v$VERSION"

echo "Release complete!"