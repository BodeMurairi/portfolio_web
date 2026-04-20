ALTER TABLE educations
ADD COLUMN education_id VARCHAR(50);

ALTER TABLE educations
ADD CONSTRAINT education_id_unique UNIQUE (education_id);

CREATE INDEX idx_education_education_id ON educations(education_id);

ALTER TABLE projects
ADD COLUMN project_id VARCHAR(1000);

ALTER TABLE projects
ADD CONSTRAINT project_id_unique UNIQUE (project_id);

CREATE INDEX idx_project_project_id ON projects(project_id);

ALTER TABLE projects
ADD COLUMN demo_url VARCHAR(1000);

ALTER TABLE projects
ADD CONSTRAINT project_demo_url_unique UNIQUE (demo_url);

CREATE INDEX idx_project_demo_url ON projects(demo_url);

ALTER TABLE certifications
ADD COLUMN certification_url VARCHAR(1000);

ALTER TABLE certifications
ADD CONSTRAINT certification_url_unique UNIQUE (certification_url);

CREATE INDEX idx_certification_certification_url ON certifications(certification_url);

ALTER TABLE certifications
ADD COLUMN certification_id VARCHAR(1000);

ADD CONSTRAINT certification_id_unique UNIQUE (certification_id);

CREATE INDEX idx_certification_certification_id ON certifications(certification_id);

ALTER TABLE professional_skills
ADD COLUMN skill_id VARCHAR(1000);

ADD CONSTRAINT skill_id_unique UNIQUE (skill_id);

CREATE INDEX idx_skill_skill_id ON professional_skills(skill_id);
