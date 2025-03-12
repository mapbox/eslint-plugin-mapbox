#!/bin/bash

# Exit if any command fails
set -e

# Find and execute all `.test.js` files in the 'tests' directory
for test_file in ./tests/*.test.js; do
  echo "Running test: $test_file"
  node "$test_file"
done

echo "✅ All rule tests passed!"