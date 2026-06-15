import os

EXCLUDE_DIRS = {"__pycache__", "env", ".git", "node_modules", ".serverless", "requirements.txt"}

def print_tree(start_path, prefix=""):
    items = sorted(os.listdir(start_path))

    # remove excluded folders
    items = [item for item in items if item not in EXCLUDE_DIRS]

    for index, item in enumerate(items):
        path = os.path.join(start_path, item)
        is_last = index == len(items) - 1

        connector = "└── " if is_last else "├── "
        print(prefix + connector + item)

        if os.path.isdir(path):
            extension = "    " if is_last else "│   "
            print_tree(path, prefix + extension)

print_tree(".")