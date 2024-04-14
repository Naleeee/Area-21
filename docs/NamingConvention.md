# Naming Convention

Welcome to the **commit convention**.

If you would like to add anything to the repository please make sure to **follow** the following simple rules.

<br/>

## Table of Contents

- [Commit Convention](#commit-convention)
  - [Commit Convention](#commit-convention)
  - [Commit Examples](#commit-examples)
- [Branch Naming Convention](#branch-naming-convention)
  - [Branch Convention](#branch-convention)
  - [Branch Examples](#branch-examples)
- [Merge requests](#merge-requests)
  - [Merge requests description](#merge-requests-description)
  - [Merge requests commit](#merge-requests-commits)

<br/>

## Commit Convention

Commits should look like this:

`<type>([scope]): <description>`

`[body]`

<br/>

### Commit Convention

- **Type**:

  The type of the classification of the modification you are committing.

  For example, if you are adding a new functionality it will be `feat`.

  If you are solving a bug it will be `fix`.

  Here is a list of `type` keyword.

  - `feat`: adding of a new functionality / new library
  - `fix`: Resolving a problem (bug, wrong display)
  - `doc`: Adding new documentation
  - `refact`: Refactoring a part of code / all the code
  - `test`: Adding tests
  - `improvement`: Upgrading an existing functionality

- **Scope**:

  The scope is optional, it's an indication of the part of code / functionality your committing into.

  For example, if you're adding a ci you can use: `feat(ci)`.

- **Description**:

  The description is a brief text that describe what you are committing.

- **Body**:

  The body is an optional additional information to add supports (links, images, ...)

  Or just describe in details the problem you are fixing / you find

<br/>

### Commit Examples

- **Adding a new card to the dashboard**:

  Commit will look like this:

  `feat(Dashboard): Added new card`

- **Fix a bug in the navbar**:

  Commit will look like this:

  `fix(Navbar): Fixed extra size`

## Branch Naming Convention

Branches names should look like this:

`<issue-number>_<parent-branch>_<issue-summary>`

### Branch Convention

- **Issue number**:

    The ID of the issue the branch is created for work on.

- **Parent branch**:

    The name of the branch this branch will be merged to (and often is created from).

    It is often the 'category' of the work.

- **Issue summary**:

    The summary of the issue the branch is created for.

### Branch Examples

- **Need to add a new element to the dashboard, the issue #42 from `dev`**:

    Branch name will be:

    `42_dev_Create-new-element-to-dashboard`

- **Need to fix the size of the navbar, issue #66 from `dev`**:

    Branch name will be:

    `66_dev_Fix-navbar-size`

<br/>

## Merge requests

### Merge requests description

You do not have to merge yourself, gitlab does it for you.

When pushing on a branch other than dev, you **must** merge your code only using gitlab merge requests.  

In the merge request, you can:
- Choose the target and the source branch
- Choose to delete the source branch or not
- Squash the commits in one
- Edit the commit message
- View commits that will be merged
- View pipelines related to this merge request
- View changes of this merge request

### Merge requests commits

Merge requests commits (or name) should have a specific form.

`AR-<ticket-number> - Merge branch <source-branch> into <target-branch>`.

`ticket-number` is the Jira ticket number this commit is linked to.  
`source-branch` is your branch, the branch where the new code comes from.  
`target-branch` is the branch you want to merge on, usually `dev`.

For example: `AR-6 - Merge branch 6_dev_Create-dashboard into dev`.
