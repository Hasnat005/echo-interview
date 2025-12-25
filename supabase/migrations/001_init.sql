-- Enable UUID generation
create extension if not exists "pgcrypto";

-- Enums
create type if not exists role_enum as enum ('candidate', 'recruiter');
create type if not exists interview_status_enum as enum ('pending', 'in_progress', 'completed');

create table if not exists organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role role_enum not null,
  organization_id uuid references organizations(id),
  constraint profiles_role_check check (role in ('candidate', 'recruiter'))
);

create table if not exists jobs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references organizations(id) on delete cascade,
  title text not null,
  description text,
  requirements jsonb
);

create table if not exists interviews (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  candidate_id uuid not null references profiles(id) on delete cascade,
  status interview_status_enum not null,
  overall_score int
);

create table if not exists questions (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references jobs(id) on delete cascade,
  text text not null,
  difficulty text
);

create table if not exists responses (
  id uuid primary key default gen_random_uuid(),
  interview_id uuid not null references interviews(id) on delete cascade,
  question_id uuid not null references questions(id) on delete cascade,
  response_text text,
  ai_feedback jsonb
);

-- Enable RLS
alter table if exists organizations enable row level security;
alter table if exists profiles enable row level security;
alter table if exists jobs enable row level security;
alter table if exists interviews enable row level security;
alter table if exists questions enable row level security;
alter table if exists responses enable row level security;

-- Indexes on foreign keys
create index if not exists idx_profiles_organization_id on profiles (organization_id);
create index if not exists idx_jobs_organization_id on jobs (organization_id);
create index if not exists idx_interviews_job_id on interviews (job_id);
create index if not exists idx_interviews_candidate_id on interviews (candidate_id);
create index if not exists idx_questions_job_id on questions (job_id);
create index if not exists idx_responses_interview_id on responses (interview_id);
create index if not exists idx_responses_question_id on responses (question_id);

-- Ensure columns use enums when migrating existing databases
do $$
begin
  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'profiles' and column_name = 'role' and data_type <> 'USER-DEFINED') then
    alter table profiles alter column role type role_enum using role::role_enum;
  end if;

  if exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'interviews' and column_name = 'status' and data_type <> 'USER-DEFINED') then
    alter table interviews alter column status type interview_status_enum using status::interview_status_enum;
  end if;
end;
$$;

-- Recruiter policies (organization-scoped via profiles.role = 'recruiter')

create policy recruiters_select_organizations on organizations
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and p.organization_id = organizations.id
    )
  );

create policy recruiters_select_jobs on jobs
  for select using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and p.organization_id = jobs.organization_id
    )
  );

create policy recruiters_insert_jobs on jobs
  for insert with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and p.organization_id = jobs.organization_id
    )
  );

create policy recruiters_update_jobs on jobs
  for update using (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and p.organization_id = jobs.organization_id
    )
  ) with check (
    exists (
      select 1 from profiles p
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and p.organization_id = jobs.organization_id
    )
  );

create policy recruiters_select_interviews on interviews
  for select using (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = interviews.job_id
    )
  );

create policy recruiters_insert_interviews on interviews
  for insert with check (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = interviews.job_id
    )
  );

create policy recruiters_update_interviews on interviews
  for update using (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = interviews.job_id
    )
  ) with check (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = interviews.job_id
    )
  );

create policy recruiters_select_questions on questions
  for select using (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = questions.job_id
    )
  );

create policy recruiters_insert_questions on questions
  for insert with check (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = questions.job_id
    )
  );

create policy recruiters_update_questions on questions
  for update using (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = questions.job_id
    )
  ) with check (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and j.id = questions.job_id
    )
  );

create policy recruiters_select_responses on responses
  for select using (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      join interviews i on i.job_id = j.id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and i.id = responses.interview_id
    )
  );

create policy recruiters_insert_responses on responses
  for insert with check (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      join interviews i on i.job_id = j.id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and i.id = responses.interview_id
    )
  );

create policy recruiters_update_responses on responses
  for update using (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      join interviews i on i.job_id = j.id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and i.id = responses.interview_id
    )
  ) with check (
    exists (
      select 1
      from profiles p
      join jobs j on j.organization_id = p.organization_id
      join interviews i on i.job_id = j.id
      where p.id = auth.uid()
        and p.role = 'recruiter'
        and i.id = responses.interview_id
    )
  );

-- Candidate policies (self-scoped)

create policy candidates_select_profile on profiles
  for select using (
    id = auth.uid()
  );

create policy candidates_select_interviews on interviews
  for select using (
    candidate_id = auth.uid()
  );

create policy candidates_select_responses on responses
  for select using (
    exists (
      select 1
      from interviews i
      where i.id = responses.interview_id
        and i.candidate_id = auth.uid()
    )
  );
