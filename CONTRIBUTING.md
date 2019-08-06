# Instructions for posting content

> For **Antares team** members only. You will need write access to create pull request. Email Jason Freeberg with any questions or to request access.

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

1. Run the local Jekyll server. From the project directory, run the following command:

    ```bash
    bundle exec jekyll serve
    ```

    The blog will be running at <http://127.0.0.1:4000/>

> **VSCODE**: If you are using VSCode to author your blog post, please install [Markdown Linting extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)

## Authoring your post

1. Create a new branch for your article(s).
    - If you are not comfortable on the command line, download [GitHub Desktop](https://desktop.github.com/).

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

1. Now you can author your markdown-formatted post. When you save the file, the local server will update the file in the browser (~30 second lag time).
    - For Markdown syntax, please see the [Markdown cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
    - For Jekyll-related formatting, please see these [Jekyll Docs](https://jekyllrb.com/docs/posts/).
    - Our blog uses the popular [Minimal Mistakes](https://github.com/mmistakes) theme. If you would like to do advanced markup for your post, please see the theme [configuration guide](https://mmistakes.github.io/minimal-mistakes/docs/posts/).

## Digital Content

To add images, GIFs, or other digital content to your post...

1. Add the file under the `/media/YEAR/MONTH/` directory.
    - Where `YEAR` and `MONTH` are the year and month in your article's filename. If the directory for the year or month does not yet exist, please create them.
1. Once the file is added, you can link to the file in your markdown using the path `{{ site.baseurl }}/media/YEAR/MONTH/your_file_name.jpg`. For example, to insert an image in Markdown you would use the following syntax

    ```text
    ![Required description of the image]({{ site.baseurl }}/media/2019/04/portal-picture.jpg)
    ```

    For more information on `baseurl`, please see [this post](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/).

## Publishing

1. Proofread your post for spelling and grammar
    - **Pro-Tips**: Copy/paste your content into Word to check spelling. Also, install the VSCode [Markdown Linting extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint).
1. Submit a pull request
1. Tag `@jasonfreeberg` in your pull request
    - Send an email if it is high priority
