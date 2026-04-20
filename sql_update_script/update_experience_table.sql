ALTER TABLE work_experiences
ADD COLUMN experience_id VARCHAR(50);

ALTER TABLE work_experiences
ADD CONSTRAINT experience_id_unique UNIQUE (experience_id);

CREATE INDEX idx_work_experience_experience_id ON work_experiences(experience_id);

ALTER TABLE work_experiences
ADD COLUMN company_url VARCHAR(50);

CREATE INDEX idx_work_experience_company_url ON work_experiences(company_url);

ALTER TABLE work_experiences
ADD COLUMN responsabilities TEXT;

CREATE INDEX idx_work_experience_responsabilities ON work_experiences(responsabilities);

ALTER TABLE articles
ADD COLUMN type TEXT;

CREATE INDEX idx_type ON articles(type);
