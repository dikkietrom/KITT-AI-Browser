#!/bin/bash

# Create the C source file
cat << EOF > example.c
#include <stdio.h>

int main() {
    printf("Hello, world!\n");
    return 0;
}
EOF

# Compile the source code
gcc -o example example.c

# Execute the resulting program
./example

# Clean up the intermediate files
rm example.c example
