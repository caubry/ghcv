# GitHub CV

1. [Fork](https://github.com/jamesmcfadden/ghcv/fork) and clone the repository
2. `git checkout -b gh-pages`
3. Edit `config/app.json` and replace `"username": "jamesmcfadden"` with your own GitHub username
4. `git add -A ; git commit -m "Update username" ; git push origin gh-pages`
5. Navigate to `http://yourusername.github.io/ghcv`

## Keeping up to date

Create a new remote with this repository as the url:
    
    # Track on a new remote
    git remote add upstream git@github.com:jamesmcfadden/ghcv.git

    # Checkout your gh-pages
    git checkout gh-pages

    # Fetch any new changes
    git fetch upstream

    # Merge the new changes into current branch
    git merge upstream/master

For more, read the GitHub help article on [syncing a fork](https://help.github.com/articles/syncing-a-fork)