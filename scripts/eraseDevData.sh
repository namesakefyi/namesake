for tableName in `npx convex data`; do npx convex import --table $tableName --replace -y --format jsonLines /dev/null; done
