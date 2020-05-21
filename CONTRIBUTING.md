# Instructions for publishing content

## What content belongs here?

The App Service Team Blog is a great place to share content with our users. Before you start writing, make sure that your content belongs to one of the approved categories:

- Advanced usages of App Service, or How-To guides for specific language frameworks
- Feature announcements, runtime version updates, etc.
  - Any major feature updates should be cross-posted on [Azure Updates](https://azure.microsoft.com/blog/)
- Deep-dive content into our service or development processes
- Announcements about upcoming events, or recaps of past events
- Best practices

## Access

1. Get contributor access to the repository. Email Jason Freeberg with your GitHub username. This will allow you to submit pull requests without creating and maintaining your own fork of the repository.

## Environment Setup

1. Download and install the [Ruby development kit](https://jekyllrb.com/docs/installation/)

1. Clone the project

    ```bash
    git clone https://github.com/Azure/AppService.git
    ```

1. Install any missing Ruby gems:

    ```bash
    bundle install
    ```

1. Install [GitHub Desktop](https://desktop.github.com/) for making branches, pull requests, etc.

1. We suggest using VS Code to author your blog post. Install [Markdown Linting extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) to make your life easier.

## Authoring your post

1. Run the local Jekyll server. From the project directory, run the following command:

    ```bash
    bundle exec jekyll serve --limit_posts=50 --incremental
    ```

    The blog will be running at <http://127.0.0.1:4000/AppService/>. (The `--limit_posts=5` arg only builds the latest 5 articles. This speeds up the time-to-refresh.)

1. Create a new branch for your article(s). If you are not using GitHub Desktop, run the command `git checkout -b [name_of_your_new_branch]`

1. Create a markdown file under the `_posts` directory with the following file name format: `YYYY-MM-DD-Your Article Title.md`

1. Add the following to the top of your posts:

    ```yaml
    ---
    title: "Title should be the same (or similar to) your filename"
    author_name: "Your Name"
    tags:
        - example
        - multiple words
        - no more than 3 tags
    ---
    ```

    The `tags` section is optional.

1. Now you can author your markdown-formatted post. When you save the file, the local server will update the file in the browser.

    - For Markdown syntax, please see the [Markdown cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
    - For Jekyll-related formatting, please see these [Jekyll Docs](https://jekyllrb.com/docs/posts/).
    - Our blog uses the popular [Minimal Mistakes](https://github.com/mmistakes) theme. If you would like to do advanced markup for your post, please see the theme [configuration guide](https://mmistakes.github.io/minimal-mistakes/docs/posts/).

### Adding Digital Content

To add images, GIFs, or other digital content to your post...

1. Add the file under the `/media/YEAR/MONTH/` directory.
    - Where `YEAR` and `MONTH` are the year and month in your article's filename. If the directory for the year or month does not yet exist, please create them.
1. Once the file is added, you can link to the file in your markdown using the path `{{ site.baseurl }}/media/YEAR/MONTH/your_file_name.jpg`. For example, to insert an image in Markdown you would use the following syntax

    ```text
    ![Required description of the image]({{ site.baseurl }}/media/2019/04/portal-picture.jpg)
    ```

    For more information on `baseurl`, please see [this post](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/).

## Publishing

1. Proofread your post for spelling and grammar:

    - If you are using VSCode, please install: [Markdown Linting extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) and fix all linting issues.
    - Install the [Code Spell checker extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) this should help catch spelling mistakes and typos.

1. Submit a pull request

    - [Using GitHub Desktop](https://help.github.com/en/desktop/contributing-to-projects/creating-a-pull-request)

1. Tag `@jasonfreeberg` in your pull request
    - Send an email if it is high priority

### Notes

- [/media](/media): All images and digital content from the old MSDN blog
- [/resource](/resource): All the CSS and JS content from the old MSDN blog
