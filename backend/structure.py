import os

IGNORE_DIRS = {
    "__pycache__",
    ".git",
    ".venv",
    "venv",
    "env",
    "node_modules",
    ".idea",
    ".vscode",
    ".pytest_cache",
    ".mypy_cache",
    ".ruff_cache",
    "dist",
    "build",
}

IGNORE_FILES = {".DS_Store", "structure.py"}


def build_tree(root, prefix=""):
    lines = []

    entries = sorted(
        [
            entry
            for entry in os.listdir(root)
            if entry not in IGNORE_DIRS and entry not in IGNORE_FILES
        ]
    )

    for index, entry in enumerate(entries):
        path = os.path.join(root, entry)
        connector = "└── " if index == len(entries) - 1 else "├── "
        lines.append(prefix + connector + entry)

        if os.path.isdir(path):
            extension = "    " if index == len(entries) - 1 else "│   "
            lines.extend(build_tree(path, prefix + extension))

    return lines


if __name__ == "__main__":
    project_root = "."
    lines = [os.path.basename(os.path.abspath(project_root))]
    lines.extend(build_tree(project_root))

    with open("project_structure.txt", "w", encoding="utf-8") as f:
        f.write("\n".join(lines))

    print("Project structure saved to project_structure.txt")
