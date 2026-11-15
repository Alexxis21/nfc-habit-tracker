ALTER TABLE nfc_tag RENAME COLUMN uid TO tag_id;
ALTER TABLE nfc_tag RENAME CONSTRAINT nfc_tag_uid_key TO nfc_tag_tag_id_key;
