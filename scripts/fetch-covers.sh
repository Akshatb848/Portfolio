#!/usr/bin/env bash
# Downloads the Higgsfield (Recraft V4.1 vector) project covers into public/covers/<project id>.svg.
# The site uses them automatically on the next build; without them it draws generative covers.
set -euo pipefail
out="$(dirname "$0")/../public/covers"
mkdir -p "$out"
base=https://d8j0ntlcm91z4.cloudfront.net/user_3Iv0tlffo0mAWvDQE0vV3SRvARt
while read -r id file; do
  curl -fsSL -o "$out/$id.svg" "$base/$file"
  # Covers are inlined as <img>, which never runs scripts, but refuse anything unexpected anyway.
  if grep -qiE '<script|<foreignObject|\son[a-z]+=' "$out/$id.svg"; then
    echo "refusing $id.svg: unexpected markup" >&2; rm "$out/$id.svg"; exit 1
  fi
done <<'LIST'
13 hf_20261012_110234_8cf42226-8f2b-4f15-87ff-508282d747aa.svg
1 hf_20261012_110236_cc0b414d-8a12-486b-b84f-e2633af9885a.svg
2 hf_20261012_110236_77da9680-064b-4cbe-ad01-e7e144297ce7.svg
3 hf_20261012_110235_6cf12429-a315-4e31-becb-dff833cd2c9b.svg
4 hf_20261012_110234_fa195bbe-b0cf-42a5-81b1-1d65c00f8f12.svg
5 hf_20261012_110237_4705a1de-015f-4a9c-b86b-fc25f9577533.svg
7 hf_20261012_110235_2c0770ee-3d99-4d2d-87fe-46979651980f.svg
8 hf_20261012_110235_b2b3f4bc-a3d5-43b0-8076-29fffaba41eb.svg
9 hf_20261012_110236_0f896095-7296-4244-ab7a-18dbf6cbfa85.svg
10 hf_20261012_110234_ef5cda77-8fc8-4c36-bd4e-79f83a257870.svg
11 hf_20261012_110237_3ea3e72f-91ae-42b3-b889-7c1a2bd20164.svg
12 hf_20261012_110234_dea2b374-60e9-45f0-87ae-9f588ad5438c.svg
LIST
ls -lh "$out"
