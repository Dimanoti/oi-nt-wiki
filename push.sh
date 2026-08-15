#!/usr/bin/env bash

set -e

if [ -z "$1" ]; then
    echo '用法：./push.sh "提交说明"'
    exit 1
fi

git add .

if git diff --cached --quiet; then
    echo "没有需要提交的修改。"
    exit 0
fi

git commit -m "$1"
git push

echo "推送完成！"