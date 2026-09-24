# Package Publishing

UI/UX Master uses npmjs as the primary public registry and GitHub as the source of truth for code, issues, releases, and automation.

## Registry Strategy

| Registry | Package name | Role |
|---|---|---|
| npmjs | `ui-ux-master` | Primary public package for `npm install`, `npx`, and discoverability |
| GitHub Packages | `@seance1723/ui-ux-master` | Optional scoped mirror to populate the GitHub repository Packages section |

Keep the npmjs package as `ui-ux-master`. If you also publish to GitHub Packages, publish a scoped mirror from CI so the source package name does not need to change.

## npmjs vs GitHub Packages

npmjs is the default npm registry. It is where most developers expect public JavaScript packages to live, and it is the best place for public discoverability, downloads, search, and normal `npx` usage.

GitHub Packages is GitHub's package registry. It is useful for packages tied tightly to a repository or organization, private packages, and showing a package in the repository Packages section. For npm packages, GitHub Packages expects scoped package names such as `@seance1723/ui-ux-master`.

The GitHub "No packages published" message does not mean the npmjs package is broken. It only means nothing has been published to GitHub Packages for that repository.

## GitHub Packages Setup

The root `.npmrc` intentionally configures only the `@seance1723` scope. It does not change the default registry, so normal `npm install ui-ux-master` and `npm publish` for the unscoped npmjs package still use npmjs.

Scoped GitHub Packages configuration:

```ini
@seance1723:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

Local install from GitHub Packages:

```bash
npm install @seance1723/ui-ux-master --registry=https://npm.pkg.github.com
```

Many GitHub Packages installs require authentication. Use a token with `read:packages` for installs and `write:packages` for publishing.

## Secrets

Add these repository secrets:

- `NPM_TOKEN` - npm automation token with publish access to `ui-ux-master`.

GitHub Packages publishing uses the built-in `GITHUB_TOKEN` in Actions. The workflow temporarily changes the package name to `@seance1723/ui-ux-master` only for that publish job, then publishes to `https://npm.pkg.github.com/`. Do not permanently rename the root package unless you intentionally want to migrate away from the public unscoped npmjs package.

## Release Strategy

Use semantic versioning:

- Patch: documentation fixes, metadata improvements, bug fixes that preserve behavior.
- Minor: new agent templates, new MCP resources, new commands, backward-compatible workflow improvements.
- Major: breaking CLI behavior, changed trigger contract, removed assets, changed package entrypoint semantics.

Recommended flow:

```bash
npm run release:check
npm version patch
git push origin main --follow-tags
```

Create a GitHub release for the new tag, for example `v1.2.1`. The publish workflow will validate and publish.

## npm Optimization Checklist

- Keep `repository`, `homepage`, `bugs`, `license`, `author`, `funding`, and keywords current.
- Keep `files` tight so generated assets and local graph/cache files stay out of the package.
- Run `npm pack --dry-run` before publishing.
- Prefer provenance publishing through GitHub Actions.
- Keep README install examples short and copyable.
- Keep `exports` stable once published.
- Avoid runtime dependencies unless they clearly improve the CLI or MCP server.

## GitHub Presentation Checklist

- Add a concise About description and npm link.
- Add SEO topics listed in README.
- Use releases with human-written notes.
- Keep Issues enabled and use issue templates.
- Pin the repository on the maintainer profile.
- Add screenshots or a short terminal GIF later if the CLI becomes more visual.
