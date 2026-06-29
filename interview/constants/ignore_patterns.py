IGNORE_DIRECTORIES = {
    # Version Control
    ".git",
    ".github",

    # IDEs
    ".idea",
    ".vscode",

    # Python
    "__pycache__",
    "venv",
    ".venv",
    "env",
    ".mypy_cache",
    ".pytest_cache",
    ".ruff_cache",

    # Node.js
    "node_modules",
    ".npm",
    ".yarn",
    ".pnpm-store",

    # Build / Distribution
    "dist",
    "build",
    "out",
    "coverage",

    # Java / Kotlin
    "target",
    ".gradle",

    # .NET
    "bin",
    "obj",

    # Next.js / Nuxt
    ".next",
    ".nuxt",

    # Frontend
    ".cache",

    # Mobile
    ".dart_tool",
    ".expo",

    # Rust
    "target",

    # Go
    "vendor",

    # Misc
    ".terraform",
    ".serverless",
    ".aws-sam",
}

IGNORE_FILES = {
    # Environment
    ".env",
    ".env.local",
    ".env.production",
    ".env.development",

    # Git
    ".gitignore",
    ".gitattributes",

    # Node Lock Files
    "package-lock.json",
    "yarn.lock",
    "pnpm-lock.yaml",

    # Python Lock Files
    "poetry.lock",
    "Pipfile.lock",

    # Rust
    "Cargo.lock",

    # Misc
    ".DS_Store",
    "Thumbs.db",

    # Logs
    "npm-debug.log",
    "yarn-error.log",

    # Generated
    "*.min.js",
    "*.min.css",
}

