
USE master;
GO

-- XÓA DB CŨ
IF EXISTS (SELECT name FROM sys.databases WHERE name = 'MGX_DB')
BEGIN
    ALTER DATABASE MGX_DB SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE MGX_DB;
    PRINT 'Old MGX_DB dropped!';
END
GO

-- TẠO DB MỚI
CREATE DATABASE MGX_DB;
PRINT 'New MGX_DB created!';
GO
USE MGX_DB;
GO

-- =============================================
-- 1. AspNetUsers
-- =============================================
CREATE TABLE dbo.AspNetUsers (
    Id                   bigint IDENTITY(1,1) PRIMARY KEY,
    UserName             nvarchar(256) NULL,
    NormalizedUserName   nvarchar(256) NULL,
    Email                nvarchar(256) NULL,
    NormalizedEmail      nvarchar(256) NULL,
    EmailConfirmed       bit NOT NULL DEFAULT 0,
    PasswordHash         nvarchar(max) NULL,
    SecurityStamp        nvarchar(max) NULL,
    ConcurrencyStamp     nvarchar(max) NULL,
    PhoneNumber          nvarchar(max) NULL,
    PhoneNumberConfirmed bit NOT NULL DEFAULT 0,
    TwoFactorEnabled     bit NOT NULL DEFAULT 0,
    LockoutEnd           datetimeoffset NULL,
    LockoutEnabled       bit NOT NULL DEFAULT 1,
    AccessFailedCount     int NOT NULL DEFAULT 0,
    Name                 nvarchar(100) NULL,
    Avatar               nvarchar(500) NULL
);
PRINT 'Table AspNetUsers created!';

INSERT INTO dbo.AspNetUsers (UserName, Email, NormalizedUserName, NormalizedEmail, EmailConfirmed, PasswordHash, Name, Avatar) VALUES
('admin@mgx.com', 'admin@mgx.com', 'ADMIN@MGX.COM', 'ADMIN@MGX.COM', 1, 'HASH', 'Nguyễn Admin', 'https://i.pravatar.cc/150?img=1'),
('pm@mgx.com', 'pm@mgx.com', 'PM@MGX.COM', 'PM@MGX.COM', 1, 'HASH', 'Trần PM', 'https://i.pravatar.cc/150?img=2'),
('dev1@mgx.com', 'dev1@mgx.com', 'DEV1@MGX.COM', 'DEV1@MGX.COM', 1, 'HASH', 'Lê Dev', 'https://i.pravatar.cc/150?img=3'),
('dev2@mgx.com', 'dev2@mgx.com', 'DEV2@MGX.COM', 'DEV2@MGX.COM', 1, 'HASH', 'Phạm Frontend', 'https://i.pravatar.cc/150?img=4'),
('qa@mgx.com', 'qa@mgx.com', 'QA@MGX.COM', 'QA@MGX.COM', 1, 'HASH', 'Nguyễn QA', 'https://i.pravatar.cc/150?img=5'),
('design@mgx.com', 'design@mgx.com', 'DESIGN@MGX.COM', 'DESIGN@MGX.COM', 1, 'HASH', 'Lý Designer', 'https://i.pravatar.cc/150?img=6'),
('client@mgx.com', 'client@mgx.com', 'CLIENT@MGX.COM', 'CLIENT@MGX.COM', 1, 'HASH', 'Khách Hàng A', 'https://i.pravatar.cc/150?img=7'),
('ceo@mgx.com', 'ceo@mgx.com', 'CEO@MGX.COM', 'CEO@MGX.COM', 1, 'HASH', 'CEO Minh', 'https://i.pravatar.cc/150?img=8');
GO

-- =============================================
-- 2. Workspaces
-- =============================================
CREATE TABLE dbo.Workspaces (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    Name      nvarchar(100) NOT NULL,
    OwnerId   bigint NOT NULL,
    CreatedAt datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Workspaces_Owner FOREIGN KEY (OwnerId) REFERENCES dbo.AspNetUsers(Id) ON DELETE NO ACTION
);
CREATE INDEX IX_Workspaces_OwnerId ON dbo.Workspaces(OwnerId);
PRINT 'Table Workspaces created!';

INSERT INTO dbo.Workspaces (Name, OwnerId) VALUES ('MGX Team', 1), ('Client Project', 7), ('Internal Tools', 8);
GO

-- =============================================
-- 3. Projects
-- =============================================
CREATE TABLE dbo.Projects (
    Id          bigint IDENTITY(1,1) PRIMARY KEY,
    WorkspaceId bigint NOT NULL,
    Name        nvarchar(100) NOT NULL,
    Color       nvarchar(20) NULL,
    CreatedAt   datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Projects_Workspace FOREIGN KEY (WorkspaceId) REFERENCES dbo.Workspaces(Id) ON DELETE CASCADE
);
CREATE INDEX IX_Projects_WorkspaceId ON dbo.Projects(WorkspaceId);
PRINT 'Table Projects created!';

INSERT INTO dbo.Projects (WorkspaceId, Name, Color) VALUES
(1, 'MGX App v2', '#6366f1'),
(1, 'Website Redesign', '#10b981'),
(2, 'E-commerce MVP', '#ef4444'),
(2, 'CRM Module', '#8b5cf6'),
(3, 'Internal Dashboard', '#06b6d4');
GO

-- =============================================
-- 4. Lists
-- =============================================
CREATE TABLE dbo.Lists (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    ProjectId bigint NOT NULL,
    Name      nvarchar(50) NOT NULL,
    [Order]   int NOT NULL DEFAULT 0,
    CreatedAt datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Lists_Project FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(Id) ON DELETE CASCADE
);
CREATE INDEX IX_Lists_ProjectId ON dbo.Lists(ProjectId);
CREATE INDEX IX_Lists_Order ON dbo.Lists(ProjectId, [Order]);
PRINT 'Table Lists created!';

DECLARE @p INT = 1;
WHILE @p <= 5
BEGIN
    INSERT INTO dbo.Lists (ProjectId, Name, [Order]) VALUES
        (@p, 'Todo', 1),
        (@p, 'Review', 2),
        (@p, 'In Progress', 3),
        (@p, 'Testing', 4),
        (@p, 'Done', 5);
    SET @p = @p + 1;
END
GO

-- =============================================
-- 5. Tasks
-- =============================================
CREATE TABLE dbo.Tasks (
    Id          bigint IDENTITY(1,1) PRIMARY KEY,
    ListId      bigint NOT NULL,
    Title       nvarchar(500) NOT NULL,
    Description nvarchar(max) NULL,
    Priority    nvarchar(20) DEFAULT 'normal' CHECK (Priority IN ('low','normal','high','urgent')),
    DueDate     datetime2 NULL,
    Tags        nvarchar(max) DEFAULT '[]',
    CreatedAt   datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Tasks_List FOREIGN KEY (ListId) REFERENCES dbo.Lists(Id) ON DELETE CASCADE
);
CREATE INDEX IX_Tasks_ListId ON dbo.Tasks(ListId);
PRINT 'Table Tasks created!';

INSERT INTO dbo.Tasks (ListId, Title, Description, Priority, DueDate, Tags) VALUES
(1, 'Thiết kế Hero Section', 'Gradient + CTA', 'high', '2025-11-10', '["design"]'),
(2, 'API Login JWT', 'Auth + JWT', 'urgent', '2025-11-05', '["backend"]'),
(3, 'Review UI Mobile', 'Responsive check', 'normal', '2025-11-08', '["review"]'),
(6, 'Figma Mockup', 'Homepage', 'high', '2025-11-07', '["design"]'),
(11, 'Setup React Native', 'Expo', 'high', '2025-11-06', '["mobile"]'),
(16, 'Payment Stripe', 'Webhook', 'urgent', '2025-11-09', '["payment"]'),
(21, 'Customer CRUD', 'Search', 'normal', '2025-11-13', '["crm"]'),
(4, 'SignalR Chat', 'Realtime', 'high', '2025-11-12', '["realtime"]'),
(9, 'Kanban Drag', 'dnd-kit', 'normal', '2025-11-15', '["test"]'),
(25, 'Real-time Metrics', 'Chart.js', 'high', '2025-11-16', '["dashboard"]');
GO

-- =============================================
-- 6. TaskAssignees
-- =============================================
CREATE TABLE dbo.TaskAssignees (
    TaskId bigint NOT NULL,
    UserId bigint NOT NULL,
    PRIMARY KEY (TaskId, UserId),
    CONSTRAINT FK_TaskAssignees_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE CASCADE,
    CONSTRAINT FK_TaskAssignees_User FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE NO ACTION
);
PRINT 'Table TaskAssignees created!';

INSERT INTO dbo.TaskAssignees (TaskId, UserId) VALUES
(1,4),(1,6),(2,3),(3,2),(4,6),(5,4),(6,3),(7,5),(8,3),(9,4),(10,3);
GO

-- =============================================
-- 7. Subtasks
-- =============================================
CREATE TABLE dbo.Subtasks (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    TaskId    bigint NOT NULL,
    Title     nvarchar(500) NOT NULL,
    Completed bit DEFAULT 0,
    [Order]   int DEFAULT 0,
    CONSTRAINT FK_Subtasks_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE CASCADE
);
CREATE INDEX IX_Subtasks_TaskId ON dbo.Subtasks(TaskId);
PRINT 'Table Subtasks created!';

INSERT INTO dbo.Subtasks (TaskId, Title, Completed, [Order]) VALUES
(1, 'Tạo gradient', 1, 1),(1, 'Thêm CTA', 1, 2),(1, 'Animation', 0, 3),
(2, 'JWT Token', 1, 1),(2, 'Google OAuth', 0, 2),
(3, 'Test iPhone', 1, 1),(3, 'Test Android', 0, 2),
(4, 'Setup Hub', 1, 1),(4, 'Test 10 users', 0, 2),
(6, 'Wireframe', 1, 1);
GO

-- =============================================
-- 8. TaskComments
-- =============================================
CREATE TABLE dbo.TaskComments (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    TaskId    bigint NOT NULL,
    UserId    bigint NOT NULL,
    Content   nvarchar(max) NOT NULL,
    Mentions  nvarchar(max) DEFAULT '[]',
    CreatedAt datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Comments_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_User FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE NO ACTION
);
CREATE INDEX IX_TaskComments_TaskId ON dbo.TaskComments(TaskId);
PRINT 'Table TaskComments created!';

INSERT INTO dbo.TaskComments (TaskId, UserId, Content, Mentions) VALUES
(1, 2, '@design@mgx.com cần animation', '[6]'),
(1, 6, 'Đã thêm Lottie!', '[]'),
(2, 1, 'JWT xong, cần review', '[]'),
(3, 5, 'Test responsive OK', '[]'),
(4, 3, '@qa@mgx.com test realtime', '[5]'),
(6, 6, 'Figma link: figma.com/xxx', '[]'),
(7, 4, 'React Native chạy OK!', '[]'),
(8, 3, 'Stripe test mode OK', '[]');
GO

-- =============================================
-- 9. TaskAttachments
-- =============================================
CREATE TABLE dbo.TaskAttachments (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    TaskId    bigint NOT NULL,
    FilePath  nvarchar(500) NOT NULL,
    FileName  nvarchar(255) NOT NULL,
    UploadedAt datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Attachments_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE CASCADE
);
PRINT 'Table TaskAttachments created!';

INSERT INTO dbo.TaskAttachments (TaskId, FilePath, FileName) VALUES
(1, '/uploads/task1/hero.png', 'hero.png'),
(1, '/uploads/task1/wireframe.pdf', 'wireframe.pdf'),
(2, '/uploads/task2/jwt.png', 'jwt.png'),
(6, '/uploads/task6/figma.txt', 'figma.txt'),
(7, '/uploads/task7/setup.zip', 'setup.zip');
GO

-- =============================================
-- 10. TimeEntries
-- =============================================
CREATE TABLE dbo.TimeEntries (
    Id              bigint IDENTITY(1,1) PRIMARY KEY,
    TaskId          bigint NOT NULL,
    UserId          bigint NOT NULL,
    DurationMinutes int NOT NULL,
    Billable        bit DEFAULT 1,
    Description     nvarchar(max) NULL,
    CreatedAt       datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_TimeEntries_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE CASCADE,
    CONSTRAINT FK_TimeEntries_User FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE NO ACTION
);
PRINT 'Table TimeEntries created!';

INSERT INTO dbo.TimeEntries (TaskId, UserId, DurationMinutes, Billable, Description) VALUES
(1,4,180,1,'Thiết kế hero'),(1,6,120,1,'Animation'),(2,3,240,1,'JWT'),(3,2,60,1,'Review'),
(4,5,300,1,'SignalR'),(6,6,150,1,'Figma'),(7,4,200,1,'React Native'),(8,3,180,1,'Stripe');
GO

-- =============================================
-- 11. ChatRooms - SỬA: ON DELETE NO ACTION cho TaskId
-- =============================================
CREATE TABLE dbo.ChatRooms (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    ProjectId bigint NULL,
    TaskId    bigint NULL,
    Name      nvarchar(100) NOT NULL,
    CONSTRAINT FK_ChatRooms_Project FOREIGN KEY (ProjectId) REFERENCES dbo.Projects(Id) ON DELETE SET NULL,
    CONSTRAINT FK_ChatRooms_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE NO ACTION  -- ĐÃ SỬA!
);
PRINT 'Table ChatRooms created!';

INSERT INTO dbo.ChatRooms (ProjectId, TaskId, Name) VALUES
(1, NULL, 'General'), (1, NULL, 'Design Team'), (1, 1, 'Hero Chat'),
(2, NULL, 'Website Team'), (3, NULL, 'E-commerce');
GO

-- =============================================
-- 12. ChatMessages
-- =============================================
CREATE TABLE dbo.ChatMessages (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    RoomId    bigint NOT NULL,
    UserId    bigint NOT NULL,
    Content   nvarchar(max) NOT NULL,
    CreatedAt datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Messages_Room FOREIGN KEY (RoomId) REFERENCES dbo.ChatRooms(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Messages_User FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE NO ACTION
);
CREATE INDEX IX_ChatMessages_RoomId ON dbo.ChatMessages(RoomId);
PRINT 'Table ChatMessages created!';

INSERT INTO dbo.ChatMessages (RoomId, UserId, Content) VALUES
(1,1,'Chào team!'),(1,2,'Sẵn sàng!'),(1,3,'Ai làm auth?'),(2,6,'Figma link'),
(3,4,'Cần animation'),(3,6,'Đang làm'),(4,4,'Responsive OK?'),(4,2,'Đã test'),
(5,3,'Stripe OK'),(5,7,'Khách duyệt');
GO

-- =============================================
-- 13. Notifications - SỬA: ON DELETE NO ACTION cho TaskId
-- =============================================
CREATE TABLE dbo.Notifications (
    Id        bigint IDENTITY(1,1) PRIMARY KEY,
    UserId    bigint NOT NULL,
    TaskId    bigint NULL,
    Type      nvarchar(50) NOT NULL,
    [Read]    bit DEFAULT 0,
    CreatedAt datetime2 DEFAULT GETDATE(),
    CONSTRAINT FK_Notifications_User FOREIGN KEY (UserId) REFERENCES dbo.AspNetUsers(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Notifications_Task FOREIGN KEY (TaskId) REFERENCES dbo.Tasks(Id) ON DELETE NO ACTION  -- ĐÃ SỬA!
);
CREATE INDEX IX_Notifications_UserId ON dbo.Notifications(UserId);
PRINT 'Table Notifications created!';

INSERT INTO dbo.Notifications (UserId, TaskId, Type, [Read]) VALUES
(4,1,'assigned',0),(6,1,'mentioned',0),(3,2,'assigned',1),(5,4,'mentioned',0),
(2,3,'commented',1),(4,7,'assigned',0),(3,8,'assigned',0),(6,6,'assigned',1),
(4,10,'mentioned',0),(1,NULL,'system',1);
GO


PRINT '=====================================';
PRINT 'MGX DB 100% SUCCESS! NO CASCADE ERROR!';
PRINT '8 Users | 5 Projects | 10 Tasks | 25 Lists';
PRINT 'Run: SELECT * FROM Tasks;';
PRINT '=====================================';
GO