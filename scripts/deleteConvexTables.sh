# https://stack.convex.dev/yolo-fast-mvp#delete-dev-data-liberally-and-maintain-a-seed-script-to-re-initialize
for tableName in `npx convex data`; do npx convex import --table $tableName --replace -y --format jsonLines /dev/null; done
