#!/bin/sh

echo -e "\033[0;32mDeploying updates to GitHub...\033[0m"

rm -rf public

git worktree add -B master public origin/master

# Build the project.
hugo

# Go To Public folder
cd public

# Add changes to git.
git add --all && git commit -m ":pencil: rebuilding site `date`"

# Push source and build repos.
git push origin master

# Come Back up to the Project Root
cd ..
