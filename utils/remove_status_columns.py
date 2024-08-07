import re

# Read the Markdown file
with open('README.md', 'r', encoding='utf-8') as file:
    content = file.read()

# Regular expression to remove the 4th column (Status)
pattern = r'((?:\|[^|\n]*){3})\|[^|\n]*'

# Apply the regex to the content
modified_content = re.sub(pattern, r'\1', content)

# Write the modified content back to the file
with open('your_file_modified.md', 'w', encoding='utf-8') as file:
    file.write(modified_content)
