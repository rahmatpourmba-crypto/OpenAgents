1. **Apply Mega-Prompt**: Integrate the mega-prompt logic into `fetch_and_upload_yasser_viral.py` (inside the `main` function) and `fetch_and_upload_ai_viral.py` (inside the `publish_twin_ai_video` function). We will import `get_optimized_metadata` from `metadata_optimizer.py` and replace `title`, `description`, and `tags` just before uploading.
2. **Verify changes**: Run `python -c` snippets to import and verify `get_optimized_metadata` outputs correct fields, and check git diff.
3. **Test the Pipeline**: Run all relevant tests to ensure the changes are correct and have not introduced regressions.
4. **Pre-commit Steps**: Complete pre-commit steps to ensure proper testing, verification, review, and reflection are done.
5. **Submit**: Submit the changes with a clear commit message.
