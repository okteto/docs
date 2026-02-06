# The Okteto Documentation

[![Netlify Status](https://api.netlify.com/api/v1/badges/9727b18a-8038-4a4e-91ff-95315bf76ead/deploy-status)](https://app.netlify.com/sites/okteto-docs/deploys)

This repository is the source for https://okteto.com/docs. If you'd like to contribute to the documentation, please first check out our [contributing guide](CONTRIBUTING.md) for info on how to get started.

## Development

### 💻 Develop locally

*You'll need to install `node` 22+ and `yarn` 1.22+ locally in order to be able to build the doc site locally.* 


Clone the repo and then run:

```console
yarn
yarn start
```

However, it is possible to build the website locally using okteto itself without any need to install required dependencies and specific version of build tool.

### 💻 Develop locally (using Okteto)

You can launch a remote Development Environment with [Okteto](https://okteto.com) on any Kubernetes cluster with the Okteto CLI.

1. In order to configure Okteto CLI to use Okteto, run the following command at the root (replace the URL with your Okteto instance):

    ```
    okteto context use https://okteto.example.com
    ```
    **Note:** If you'd like to use any Kubernetes cluster with Okteto CLI, run the `okteto context` command and select the context you'd like to go with using arrows key

2. Once the context is setup, run the `okteto up` command. This will make sure the required docker images are built by Okteto CLI.
   
3. Once the development environment is built, go to your [Okteto](https://okteto.com/docs) and preview your changes. As soon as you hit the save, the changes will be reflected in Okteto as it'd look like in production.


## Create a new version of the Docs

*A new version of the docs is created once the documentation for a certain version is "finished". This is typically done in preparation of a new release.*

This process will:
- Release version X.Y as the new official version (e.g., 1.41)
- Move the previous official version to archived versions (e.g., 1.40 → archived)
- Set up version X.(Y+1) as the next unreleased version (e.g., 1.42)
- Remove the oldest version to maintain 12 total versions

**Prerequisites:**
- Determine the version number for the new release (e.g., `1.41`)
- Have release notes ready for the new version in `src/content/release-notes.mdx`

### Step 1: Update Variables for the New Release

Update `src/content/variables.json` with values for the version being released:

1. Update `cliVersion` to the new Okteto CLI version (e.g., `3.16.0`)
2. Update `chartVersion` to match the new release version (e.g., `1.41.0`)
3. Update `syncthingVersion` from [this Dockerfile line](https://github.com/okteto/okteto/blob/master/Dockerfile#L9)
4. If Kubernetes version support changed, update `kubernetesMinVersion` and `kubernetesMaxVersion`

Example:
```json
{
  "kubernetesMinVersion": "1.32",
  "kubernetesMaxVersion": "1.34",
  "cliVersion": "3.16.0",
  "chartVersion": "1.41.0",
  "syncthingVersion": "2.0.14"
}
```

### Step 2: Create the New Version

Run the docusaurus version command with the new version number:

```bash
yarn run docusaurus docs:version 1.XX
```

Replace `1.XX` with your version number (e.g., `1.41`).

This command will:
- Create `versioned_docs/version-1.XX/` with a snapshot of current docs
- Create `versioned_sidebars/version-1.XX-sidebars.json` with the sidebar config
- Add `1.XX` to the top of `versions.json`

### Step 3: Update docusaurus.config.js

Modify the `presets.docs.versions` section of [`docusaurus.config.js`](docusaurus.config.js):

1. **Update `lastVersion`** to the new release version (e.g., `1.41`)

2. **Update `current`** label and path to the NEXT unreleased version:
   ```js
   current: {
     label: '1.42',  // NEW_VERSION + 1
     path: '1.42',
   }
   ```

3. **Add new release version entry** at the top of `versions` object:
   ```js
   '1.41': {
     label: '1.41',
     path: '/',
     banner: 'none',
   },
   ```

4. **Update previous official version** (change path from `/` to version number and banner to `unmaintained`):
   ```js
   '1.40': {
     label: '1.40',
     path: '1.40',      // changed from '/'
     banner: 'unmaintained',  // changed from 'none'
   },
   ```

5. **Remove the oldest version entry** from the `versions` object (to maintain 12 versions total)

### Step 4: Update netlify.toml Redirects

Update the redirect rules at the bottom of [`netlify.toml`](netlify.toml):

1. **Update official version redirect:**
   ```toml
   [[redirects]]
     from = "/docs/1.41/*"    # NEW_VERSION
     to = "/docs/:splat"
     status = 301
   ```

2. **Update unreleased version redirect:**
   ```toml
   [[redirects]]
     from = "/docs/unreleased/*"
     to = "/docs/1.42/:splat"    # NEW_VERSION + 1
     status = 302
   ```

3. **Add redirect for the oldest removed version:**
   ```toml
   [[redirects]]
     from = "/docs/1.29/*"    # OLDEST_VERSION being removed
     to = "/docs/:splat"
     status = 302
   ```

### Step 5: Update archives.md

Update [`src/pages/archives.md`](src/pages/archives.md):

1. **Update "Current released version" table** with the new version:
   ```markdown
   | Version |   Documentation    |                    Release Notes |
   | :------ | :----------------: | -------------------------------: |
   | 1.41    | [Documentation](/) | [Release Notes](/release-notes/) |
   ```

2. **Add previous official version** to the "Previously released versions" table:
   ```markdown
   | 1.40    | [Documentation](/1.40) |                [Release Notes](/1.40/release-notes/) |
   ```

3. **Remove the oldest version** from the "Previously released versions" table

### Step 6: Remove the Oldest Version Files

Identify the oldest version from `versions.json` (should be at the bottom) and remove its files:

```bash
# Example: removing version 1.29
rm -rf versioned_docs/version-1.29
rm -rf versioned_sidebars/version-1.29-sidebars.json
```

**Manually remove the oldest version** from [`versions.json`](versions.json) (remove from the bottom of the array).

### Step 7: Archive Old Release Notes

Move the oldest version's release notes from active to archived:

1. **Cut the oldest version section** from the bottom of [`src/content/release-notes.mdx`](src/content/release-notes.mdx)
2. **Paste it at the top** of [`src/content/archived-release-notes.mdx`](src/content/archived-release-notes.mdx) (after the intro paragraph, before other versions)

### Step 8: Verify the Build

Run the build to catch any broken links or anchors:

```bash
yarn build
```

Fix any errors before proceeding. Common issues:
- Broken anchor links from moved release notes
- Missing redirects
- Invalid configuration in docusaurus.config.js

### Step 9: Commit and Create Pull Request

```bash
git add .
git commit -m "Release version 1.XX documentation"
git push
```

Create a pull request and reference a recent version release PR as an example (check recent merged PRs with titles like "Release version X.XX documentation").


## Quick Reference for Automation

For agents or scripts automating this process, here are the key parameters:

**Given:**
- `NEW_VERSION` = version being released (e.g., `1.41`)
- `PREV_VERSION` = current official version that will be archived (from `lastVersion` in docusaurus.config.js, e.g., `1.40`)
- `NEXT_VERSION` = NEW_VERSION + 1 (e.g., `1.42`)
- `OLDEST_VERSION` = last version in `versions.json` array (e.g., `1.29`)

**Files to modify:**

1. **src/content/variables.json** - Update with new release values
2. **Run command:** `yarn run docusaurus docs:version {NEW_VERSION}`
3. **docusaurus.config.js:**
   - `lastVersion: '{NEW_VERSION}'`
   - `current.label: '{NEXT_VERSION}'`
   - `current.path: '{NEXT_VERSION}'`
   - Add `'{NEW_VERSION}': { label: '{NEW_VERSION}', path: '/', banner: 'none' }` at top of versions
   - Change `'{PREV_VERSION}'` path from `'/'` to `'{PREV_VERSION}'` and banner from `'none'` to `'unmaintained'`
   - Remove `'{OLDEST_VERSION}'` entry from versions
4. **netlify.toml:**
   - Official redirect: `from = "/docs/{NEW_VERSION}/*"`
   - Unreleased redirect: `to = "/docs/{NEXT_VERSION}/:splat"`
   - Add deprecated redirect: `from = "/docs/{OLDEST_VERSION}/*"`
5. **src/pages/archives.md:**
   - Update current version table to `{NEW_VERSION}`
   - Add `{PREV_VERSION}` to previous versions table
   - Remove `{OLDEST_VERSION}` from previous versions table
6. **Delete files:** `versioned_docs/version-{OLDEST_VERSION}/` and `versioned_sidebars/version-{OLDEST_VERSION}-sidebars.json`
7. **versions.json** - Remove `{OLDEST_VERSION}` from array (should be last item)
8. **src/content/release-notes.mdx** - Cut bottom section for `{OLDEST_VERSION}`
9. **src/content/archived-release-notes.mdx** - Paste `{OLDEST_VERSION}` section at top (after intro)
10. **Run:** `yarn build` to verify

**Version count:** Maintain exactly 12 versions in `versions.json` after completion.

### After the new version has been merged, request a new search index and update variables for the unreleased docs version

Once the new version is live in production, complete these post-release tasks:

#### Update Search Index

Request a new search index from Algolia (manual step - requires login):

1. Log in to [Algolia Crawler](https://crawler.algolia.com/admin/crawlers)
2. On the crawlers' page, select "Okteto"
3. Click on "Restart crawling"

The search index will be completed in a few minutes.

#### Update Variables for Next Unreleased Version

Update `src/content/variables.json` to prepare for the next development cycle:

1. Increment `cliVersion` to the expected next CLI version
2. Increment `chartVersion` to match `{NEXT_VERSION}.0`
3. Keep other values unless there are known changes

Example (after releasing 1.41, preparing for 1.42):
```json
{
  "cliVersion": "3.17.0",
  "chartVersion": "1.42.0",
  "syncthingVersion": "2.0.14"
}
```

Create a PR with these changes:
```bash
git checkout main
git pull
git checkout -b prepare-variables-1.XX
# Update variables.json
git add src/content/variables.json
git commit -m "Prepare variables for version 1.XX development"
git push -u origin prepare-variables-1.XX
```

Then create a pull request for review before merging to main.

## Components

### Product tiers list

Sometimes, documentation is specific to a product tier. You can add a badge beside headings using the [TiersList](https://github.com/okteto/docs/blob/main/src/theme/TiersList/index.js) component.

##### Usage

Tiers is a `string` of tier separated by a space

```md
# Page heading<TiersList tiers="Scale Self-Hosted" />
```

### Image

Since many of our images are used across multiple versions, if a screenshot is updated but should only apply to certain versions, please create a new image with the version number included in the filename. For example, `my-image-v1.22+.png`.

##### Usage

```mdx
import Image from "@theme/Image";

<p align="center">
  <Image
    src={require("@site/static/img/my-image-v1.22+.png").default}
    alt="Movies app architecture"
    width="850"
  />
</p>
```

## Contributors

<a href="https://github.com/okteto/docs/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=okteto/docs" />
</a>

<!--  https://contrib.rocks -->
