# Instructions for publishing content

Table of contents:

- [Instructions for publishing content](#instructions-for-publishing-content)
  - [Publishing an article](#publishing-an-article)
    - [What content can I publish here?](#what-content-can-i-publish-here)
    - [Get access](#get-access)
    - [Set up your environment](#set-up-your-environment)
    - [Author your post](#author-your-post)
      - [Writing Tips](#writing-tips)
      - [Add digital content](#add-digital-content)
    - [Publish the article](#publish-the-article)
  - [The team pages](#the-team-pages)
    - [Edit a team page](#edit-a-team-page)
    - [Add a team page](#add-a-team-page)
      - [Notes](#notes)

## Publishing an article

### What content can I publish here?

The App Service Team Blog is a great place to share content with our users. Before you start writing, make sure that your content fits within one of these categories:

- Advanced usages of App Service, or How-To guides for specific language frameworks
- Feature announcements, runtime version updates, etc.
  - Any major feature updates (such as a GA release) should be cross-posted on [Azure Updates](https://azure.microsoft.com/updates/) and/or the [Azure Blog](https://azure.microsoft.com/blog/)
- Deep-dive content into our service, such as architecture or development/deployment processes
- Announcements about upcoming events, or recaps of past events
- Best practices

### Get access

1. Get contributor access to the repository. Email Jeff Martinez with your GitHub username. This will allow you to submit pull requests without creating and maintaining your own fork of the repository.

> **NOTE**
You cannot contribute from a forked repository

### Set up your environment

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

### Author your post

1. Run the local Jekyll server. From the project directory, run the following command:

    ```bash
    bundle exec jekyll serve --limit_posts=50 --incremental --future
    ```

    The blog will be running at <http://127.0.0.1:4000/AppService/>. (The `--limit_posts=5` arg only builds the latest 5 articles. This speeds up the time-to-refresh.)

1. Create a new branch for your article(s). If you are not using GitHub Desktop, run the command `git checkout -b [name_of_your_new_branch]`

1. Create a markdown file under the `_posts` directory with the following file name format: `YYYY-MM-DD-Your Article Title.md`

1. Add the following to the top of your posts (this is called the "front matter").

    ```yaml
    ---
    title: "Title should be the same (or similar to) your filename"
    author_name: "Your Name"                                          # required
    category: 'your team's category'                                  # optional
    tags:                                                             # tags are optional
        - example
        - multiple words
        - no more than 3 tags
    ---
    ```

    You can configure our post to have a table of contents or have a wide layout. See the [config guide](https://mmistakes.github.io/minimal-mistakes/docs/layouts/) for more info.

1. Now you can author your markdown-formatted post. When you save the file, the local server will update the file in the browser.

    - For Markdown syntax, please see the [Markdown cheat-sheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet).
    - For Jekyll-related formatting, please see these [Jekyll Docs](https://jekyllrb.com/docs/posts/).
    - Our blog uses the popular [Minimal Mistakes](https://github.com/mmistakes) theme. If you would like to do advanced markup for your post, please see the [theme's utility classes](https://mmistakes.github.io/minimal-mistakes/docs/utility-classes/).

#### Writing Tips

Here are some quick tips to make your blog post clear, concise, and more effective:

1. **Write an outline**. Before you jump into writing the article, outline the article using a bulleted list. Doing this will help you organize the content from top-to-bottom.
1. [**Avoid using Passive Voice**](https://www.wikihow.com/Avoid-Using-the-Passive-Voice). In most cases, the subject of the sentence should come before the verb. This is good: _"John hit the ball"_. This is bad: _"The ball was hit by John"_. The object precedes the verb in the second example. Excessive use of the passive voice will make your article longer, less clear, and awkward to read.
1. **Avoid run-on sentences**. Your article is likely going to cover a technical concept. Make things easy for the reader. Use short, concise sentences.
1. **Don't narrate with the first person**. Whenever possible, avoid "we" or "I". In instructional articles, avoid using phrases like _"we will now deploy they app"_ or _"we will move to the next topic"_. These phrases don't serve any instructional purpose, and lengthen the article unnecessarily.
    1. It is OK to refer directly to the reader as "you". For example, "Your web app is ready to deploy", or "You can now proceed to the next step".

For more best practices, please see [this deck from ACOM](https://microsoft.sharepoint.com/:p:/t/cloudosdigital/EYElo_4ScDZCqBNEHs6P7q0BD7Vl-6jnb8vaOfxhmAmE_w?e=g43Da6).

#### Add digital content

You can add images, GIFs, or other digital content to your post by adding it to the `/media/` directory and referencing the file from the post.

1. Add the file under the `/media/YEAR/MONTH/` directory.
    - Where `YEAR` and `MONTH` are the year and month in your article's filename. If the directory for the year or month does not yet exist, please create them.
1. Once the file is added, you can link to the file in your markdown using the path `{{ site.baseurl }}/media/YEAR/MONTH/your_file_name.jpg`. For example, to insert an image in Markdown you would use the following syntax

    ```text
    ![Required description of the image]({{site.baseurl}}/media/2019/04/portal-picture.jpg)
    ```

    For more information on `baseurl`, please see [this post](https://byparker.com/blog/2014/clearing-up-confusion-around-baseurl/).

### Publish the article

1. Proofread your post for spelling and grammar. Ask a friend or coworker to proof-read it as well.

    - If you are using VSCode, please install: [Markdown Linting extension](https://marketplace.visualstudio.com/items?itemName=DavidAnson.vscode-markdownlint) and fix all linting issues.
    - Install the [Code Spell checker extension](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker) this should help catch spelling mistakes and typos.

1. Submit a pull request. You can use [GitHub Desktop](https://help.github.com/en/desktop/contributing-to-projects/creating-a-pull-request) or the command line.

1. Assign `jeffwmartinez` as a reviewer for your pull request. Send an email to Jeff if it is high priority.

## The team pages

There are team pages in the left sidebar to help organize content from that team. Each Antares team can set up a team page **if they have published at least 5 relevant articles**.

### Edit a team page

1. Find your team's page under `_pages/team_pages/`
1. Edit the markdown content as you wish. You can use in-line HTML as well, see the [theme's utility classes](https://mmistakes.github.io/minimal-mistakes/docs/utility-classes/) for more information.
1. Any images should be placed under `media/pages/team_pages/your-team-name/`. See [adding digital content](#adding-digital-content) for more information on adding these images to your post.
1. When you're done making changes, submit a Pull Request and add `jeffwmartinez` as a reviewer

### Add a team page

1. Create a markdown file under `_pages/team_pages/`.
1. Add the following front matter to the markdown document (without the inline comments).

    ```yaml
    ---
    permalink: "/your-category-name/"       # Chose your own permalink
    layout: home                            # Don't change this
    title: "My team's name"                 # Short title for the page
    sidebar:
        nav: "default"                      # Don't change this
    pagination:
      enabled: true
      category: your-category-name          # Same string as your permalink, w/o the slashes
      sort_reverse: true
    ---
    ```

1. Add an entry for the team page in [`navigation.yaml`](_data/navigation.yml) 
3. Add content about your team, any relevant links, or team member photos to the body of the markdown document. See the other team pages for ideas.
4. To add articles to your team's page like the others, go back to your team's articles and add `category: your-category-name` to the articles' front matter. This will add them to your team page's paginator.

---------

#### Notes

- [/media](/media): All images and digital content from the old MSDN blog
- [/resource](/resource): All the CSS and JS content from the old MSDN blog
