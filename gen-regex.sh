#!/usr/bin/env bash

for mode in $(ls regex); do
  regex="$(cat "regex/$mode" | tr -d [:space:] | sed -e 's./.\\/.g')"
  printf "export const $mode = /%s/;\n" "$regex"
done > src/regex.ts
