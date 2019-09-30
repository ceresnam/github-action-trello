# Pull Request Trello link check

Checks existence of a Trello link in description of Pull request.

To use, create a workflow (eg: `.github/workflows/main.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) utilizing this action, granting access to the GITHUB_TOKEN so the action can make calls to GitHub's rest API:
```
name: "Pull Request Trello link check"
on:
- pull_request

jobs:
  codequality:
    runs-on: ubuntu-latest
    steps:
    - uses: ceresnam/github-action-trello@v1
      with:
        repo-token: "${{ secrets.GITHUB_TOKEN }}"
```
