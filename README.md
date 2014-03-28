# GitHub CV

1. [Fork](https://github.com/jamesmcfadden/ghcv/fork) and clone the repository
2. `git checkout -b gh-pages`
3. Edit `config/app.json` and replace `"username": "jamesmcfadden"` with your own GitHub username
4. `git add -A ; git commit -m "Update username" ; git push origin gh-pages`
5. Navigate to `http://yourusername.github.io/ghcv`

Keep in mind that you must have [GitHub Pages](http://pages.github.com) setup for this to work correctly.

Remember that you can change `/ghcv` to whatever you like by changing the name of your fork.

## Keeping up to date

At time of writing, this project is being constantly updated. To get the latest changes, you should aim to keep your fork in sync and check for changes as often as possible.

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

## Contributing

The project is very 'bare-bones' and needs quite a bit of work. My aim was to push it out as early as possible and refactor/ tidy later on, so that's the plan.

All contributions are welcome. Please direct them to the `master` branch for now. Things that definitely need work:

- Application structure (code);
- Test suite (there isn't one :));
- UI
