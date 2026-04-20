ALTER TABLE comments
ADD COLUMN parent_id INTEGER;

ALTER TABLE comments
ADD CONSTRAINT comments_parent_fk
FOREIGN KEY (parent_id)
REFERENCES comments(id)
ON DELETE CASCADE;