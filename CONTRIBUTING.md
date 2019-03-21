# Instructions for posting content

> For **Antares team** members only
>
> **Note:** You must have contributor access to the repository to publish.

## Environment Setup

1. Download and install the [Ruby development kit](https://jekyllrb.com/docs/installation/)

1. Clone the Jekyll project

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

    The blog will now be running at <http://127.0.0.1:4000/AppService/>

> **VSCODE** If you are using VSCode to author blog post please install [Markdown Linting extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint)

## Authoring new posts

1. All posts go under the `_posts` directory with the following file name format: `YYYY-MM-DD-Your Article Title.md`
    - All new posts should be in Markdown format. (Only  migrated posts are in html.

1. Add the following to the top of your posts:

    ```yaml
    ---
    layout: post
    title:  "<Insert your post title>"
    author: "<insert your name>"
    tags: <space-delimited tags>
    ---
    ```

    The `tags` section is optional.

1. At the end of your post, invite readers to post questions on the [MSDN Forums](https://social.msdn.microsoft.com/forums/azure/en-US/home?forum=windowsazurewebsitespreview). Please provide a hyperlink to the forums.

1. Now you can author your markdown-formatted post. When you save the file, the local server will update the file in the browser.

1. For Markdown syntax, please see the [Markdown cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).

1. For Jekyll-related formatting, please see these [Jekyll Docs](https://jekyllrb.com/docs/posts/).

## Digital Content

To add images, GIFs, or other digital content to your post...

1. Add the content file under the `/media/YEAR/MONTH/` directory.
    - Where `YEAR` is the current year. If the directory does not yet exist, please create one.
    - Where `MONTH` is the current year. If the directory does not yet exist, please create one.
1. Once the file is added, you can link to the file in your markdown using the path:

    ```text
    {{ site.baseurl }}/media/YEAR/MONTH/your_file_name.jpg
    ```

    For more information on `baseurl`, please see [this post](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/).

## Publishing

1. After you have proofread your post, you can publish to the GitHub Pages site using the following commands:

    ```bash
    git add -A
    git commit -m "your commit message"
    git push
    ```

 It takes about 60 seconds for posts to go live

**Contact Jason if you have any questions.**
