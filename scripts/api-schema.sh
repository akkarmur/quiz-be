#!/bin/bash

# Script to generate TypeScript types from OpenAPI YAML files
# The OpenAPI file path is constant, and no module name input is required.

# Constants
OPENAPI_FILE="../api-docs/_openapi.json"  # Path to OpenAPI file
BASE_DIR="../src/domain/swagger"         # Destination folder for types
OUTPUT_DIR="./generated-temp"            # Temporary output folder

echo "Generating TypeScript types from OpenAPI file: $OPENAPI_FILE..."

# Step 1: Generate raw TypeScript types with preserved names
mkdir -p "$OUTPUT_DIR"
openapi-generator-cli generate \
  -i "$OPENAPI_FILE" \
  -g typescript-fetch \
  -o "$OUTPUT_DIR" \
  --additional-properties=enumPropertyNaming=original,modelPropertyNaming=original

# Step 2: Process files - keep only relevant TypeScript files
mkdir -p "$BASE_DIR"

# Copy and clean files - only keep types
find "$OUTPUT_DIR" -type f -name "*.ts" | while read -r file; do
  # Extract the base filename and clean up unwanted formatting
  BASENAME=$(basename "$file")
  CLEAN_NAME=$(echo "$BASENAME" | sed 's/-/_/g')

  # Copy the clean file to the destination folder
  cp "$file" "$BASE_DIR/$CLEAN_NAME"
done

# Step 3: Remove unwanted folders/files
rm -rf "$OUTPUT_DIR"

# Step 4: Remove any unnecessary imports or redundant code (optional cleanup)
find "$BASE_DIR" -type f -name "*.ts" | while read -r ts_file; do
  # Remove 'isomorphic-fetch' or other unwanted imports (example cleanup)
  sed -i '/isomorphic-fetch/d' "$ts_file"

  # Remove empty lines at the end of the file
  sed -i '/^$/N;/^\n$/D' "$ts_file"
done

echo "TypeScript types generated successfully in $BASE_DIR!"
