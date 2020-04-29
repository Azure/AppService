#!/bin/sh
echo '👍 INSTALLING THE GEM BUNDLE'
bundle install
bundle list | grep "jekyll ("

echo '👍 BUILDING THE SITE'
echo "Jekyll env = ${JEKYLL_ENV}"
bundle exec jekyll build

echo '👍 PUSHING IT BACK TO GITHUB-PAGES'
cd _site
remote_repo="https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPOSITORY}.git"
remote_branch="gh-pages"

git init
git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
git add .
git commit -m "Automated deployment triggered by ${GITHUB_SHA}"
#git remote add origin "${remote_repo}"
git push --force $remote_repo master:$remote_branch
rm -fr .git
cd ../

echo '👍 GREAT SUCCESS!'

# Examples:
# - https://github.com/JamesIves/github-pages-deploy-action/blob/master/entrypoint.sh
# - https://github.com/maxheld83/ghpages/blob/master/entrypoint.sh 
# - 