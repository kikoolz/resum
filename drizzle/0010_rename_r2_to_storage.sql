-- Rename r2_key column to storage_key and add file_data column
ALTER TABLE user_files RENAME COLUMN r2_key TO storage_key;
ALTER TABLE user_files ADD COLUMN file_data TEXT;
