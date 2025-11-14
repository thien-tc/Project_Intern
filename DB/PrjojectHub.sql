
USE master;
GO
IF DB_ID('ProjectHub') IS NOT NULL
BEGIN
    ALTER DATABASE ProjectHub SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE ProjectHub;
END
GO
CREATE DATABASE ProjectHub;
GO
USE ProjectHub;
GO

-- ========================================
-- 1. USERS
-- ========================================
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) UNIQUE NOT NULL,
    PasswordHash NVARCHAR(255) NOT NULL,
    AvatarUrl NVARCHAR(255) NULL,
    Role NVARCHAR(50) DEFAULT 'Member',
    IsOnline BIT DEFAULT 0,
    LastSeen DATETIME DEFAULT GETDATE(),
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT CK_Users_Email CHECK (Email LIKE '%@%.%'),
    CONSTRAINT CK_Users_Role CHECK (Role IN ('Admin', 'Manager', 'Member', 'Viewer'))
);

-- ========================================
-- 2. WORKSPACES
-- ========================================
CREATE TABLE Workspaces (
    WorkspaceID INT IDENTITY(1,1) PRIMARY KEY,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(255),
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Workspaces_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);

-- ========================================
-- 3. SPACES (Projects)
-- ========================================
CREATE TABLE Spaces (
    SpaceID INT IDENTITY(1,1) PRIMARY KEY,
    WorkspaceID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(500),
    Color NVARCHAR(20) DEFAULT '#3b82f6',
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Spaces_Workspaces FOREIGN KEY (WorkspaceID) REFERENCES Workspaces(WorkspaceID) ON DELETE CASCADE
);

-- ========================================
-- 4. SPACE MEMBERS
-- ========================================
CREATE TABLE SpaceMembers (
    SpaceID INT NOT NULL,
    UserID INT NOT NULL,
    Role NVARCHAR(50) DEFAULT 'Member',
    JoinedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (SpaceID, UserID),
    CONSTRAINT FK_SpaceMembers_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE,
    CONSTRAINT FK_SpaceMembers_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT CK_SpaceMembers_Role CHECK (Role IN ('Owner', 'Admin', 'Member', 'Viewer'))
);

-- ========================================
-- 5. LISTS
-- ========================================
CREATE TABLE Lists (
    ListID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NOT NULL,
    Name NVARCHAR(100) NOT NULL,
    OrderIndex INT NOT NULL DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Lists_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE
);

-- ========================================
-- 6. TASK STATUSES
-- ========================================
CREATE TABLE TaskStatuses (
    StatusID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NULL,
    Name NVARCHAR(50) NOT NULL,
    OrderIndex INT NOT NULL,
    IsFinal BIT DEFAULT 0,
    Color NVARCHAR(20) DEFAULT '#888888',
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_TaskStatuses_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE
);

-- ========================================
-- 7. TASKS
-- ========================================
CREATE TABLE Tasks (
    TaskID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NOT NULL,
    ListID INT NULL,
    StatusID INT NOT NULL,
    Title NVARCHAR(200) NOT NULL,
    Description NVARCHAR(MAX),
    AssigneeID INT NULL,
    ReporterID INT NULL,
    StartDate DATETIME NULL,
    DueDate DATETIME NULL,
    Priority NVARCHAR(20) DEFAULT 'Normal',
    Progress INT DEFAULT 0,
    EstimatedTime INT NULL,
    TimeTracked INT DEFAULT 0,
    SprintPoints INT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    DeletedAt DATETIME NULL,
    DeletedBy INT NULL,
    CONSTRAINT FK_Tasks_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE,
    CONSTRAINT FK_Tasks_Lists FOREIGN KEY (ListID) REFERENCES Lists(ListID),
    CONSTRAINT FK_Tasks_Statuses FOREIGN KEY (StatusID) REFERENCES TaskStatuses(StatusID),
    CONSTRAINT FK_Tasks_Assignee FOREIGN KEY (AssigneeID) REFERENCES Users(UserID),
    CONSTRAINT FK_Tasks_Reporter FOREIGN KEY (ReporterID) REFERENCES Users(UserID),
    CONSTRAINT FK_Tasks_DeletedBy FOREIGN KEY (DeletedBy) REFERENCES Users(UserID),
    CONSTRAINT CK_Tasks_Priority CHECK (Priority IN ('Urgent', 'High', 'Normal', 'Low')),
    CONSTRAINT CK_Tasks_Progress CHECK (Progress >= 0 AND Progress <= 100)
);

-- ========================================
-- 8. SUBTASKS
-- ========================================
CREATE TABLE Subtasks (
    SubtaskID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NOT NULL,
    Title NVARCHAR(150) NOT NULL,
    IsCompleted BIT DEFAULT 0,
    AssigneeID INT NULL,
    OrderIndex INT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Subtasks_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_Subtasks_Assignee FOREIGN KEY (AssigneeID) REFERENCES Users(UserID)
);

-- ========================================
-- 9. TAGS
-- ========================================
CREATE TABLE Tags (
    TagID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NULL,
    Name NVARCHAR(50) NOT NULL,
    Color NVARCHAR(20) DEFAULT '#6b7280',
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Tags_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE,
    CONSTRAINT UQ_Tags_SpaceName UNIQUE (SpaceID, Name)
);

-- ========================================
-- 10. TASK TAGS
-- ========================================
CREATE TABLE TaskTags (
    TaskID INT NOT NULL,
    TagID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (TaskID, TagID),
    CONSTRAINT FK_TaskTags_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_TaskTags_Tags FOREIGN KEY (TagID) REFERENCES Tags(TagID) ON DELETE NO ACTION
);

-- ========================================
-- 11. TASK WATCHERS
-- ========================================
CREATE TABLE TaskWatchers (
    TaskID INT NOT NULL,
    UserID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (TaskID, UserID),
    CONSTRAINT FK_TaskWatchers_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_TaskWatchers_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ========================================
-- 12. TASK DEPENDENCIES
-- ========================================
CREATE TABLE TaskDependencies (
    TaskID INT NOT NULL,
    DependsOnTaskID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (TaskID, DependsOnTaskID),
    CONSTRAINT FK_TaskDependencies_Task FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_TaskDependencies_DependsOn FOREIGN KEY (DependsOnTaskID) REFERENCES Tasks(TaskID) ON DELETE NO ACTION,
    CONSTRAINT CK_TaskDependencies_NotSelf CHECK (TaskID != DependsOnTaskID)
);

-- ========================================
-- 13. CUSTOM FIELDS
-- ========================================
CREATE TABLE CustomFields (
    FieldID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NOT NULL,
    FieldName NVARCHAR(100) NOT NULL,
    FieldType NVARCHAR(50) DEFAULT 'Text',
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_CustomFields_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE,
    CONSTRAINT CK_CustomFields_Type CHECK (FieldType IN ('Text', 'Number', 'Boolean', 'Date', 'Select'))
);

-- ========================================
-- 14. TASK CUSTOM FIELD VALUES
-- ========================================
CREATE TABLE TaskCustomFieldValues (
    TaskID INT NOT NULL,
    FieldID INT NOT NULL,
    FieldValue NVARCHAR(500),
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (TaskID, FieldID),
    CONSTRAINT FK_TaskCustomFields_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_TaskCustomFields_Fields FOREIGN KEY (FieldID) REFERENCES CustomFields(FieldID)
);

-- ========================================
-- 15. COMMENTS
-- ========================================
CREATE TABLE Comments (
    CommentID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NOT NULL,
    UserID INT NOT NULL,
    Content NVARCHAR(MAX) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    IsEdited BIT DEFAULT 0,
    CONSTRAINT FK_Comments_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_Comments_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ========================================
-- 16. ATTACHMENTS
-- ========================================
CREATE TABLE Attachments (
    AttachmentID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NOT NULL,
    FileName NVARCHAR(255) NOT NULL,
    FileUrl NVARCHAR(500) NOT NULL,
    FileType NVARCHAR(50),
    FileSize BIGINT,
    UploadedBy INT,
    UploadedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Attachments_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_Attachments_Users FOREIGN KEY (UploadedBy) REFERENCES Users(UserID)
);

-- ========================================
-- 17. ACTIVITY LOGS
-- ========================================
CREATE TABLE ActivityLogs (
    LogID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NULL,
    SpaceID INT NULL,
    UserID INT NULL,
    ActionType NVARCHAR(50) NOT NULL,
    ActionDescription NVARCHAR(500) NOT NULL,
    OldValue NVARCHAR(500) NULL,
    NewValue NVARCHAR(500) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Logs_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID),
    CONSTRAINT FK_Logs_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID),
    CONSTRAINT FK_Logs_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ========================================
-- 18. TIME ENTRIES
-- ========================================
CREATE TABLE TimeEntries (
    EntryID INT IDENTITY(1,1) PRIMARY KEY,
    TaskID INT NOT NULL,
    UserID INT NOT NULL,
    Description NVARCHAR(255),
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NULL,
    Duration INT,
    IsBillable BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_TimeEntries_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE CASCADE,
    CONSTRAINT FK_TimeEntries_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ========================================
-- 19. GOALS
-- ========================================
CREATE TABLE Goals (
    GoalID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NOT NULL,
    Title NVARCHAR(150) NOT NULL,
    Description NVARCHAR(MAX),
    TargetDate DATE,
    Progress INT DEFAULT 0,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Goals_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE,
    CONSTRAINT FK_Goals_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserID),
    CONSTRAINT CK_Goals_Progress CHECK (Progress >= 0 AND Progress <= 100)
);

-- ========================================
-- 20. GOAL TASKS
-- ========================================
CREATE TABLE GoalTasks (
    GoalID INT NOT NULL,
    TaskID INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (GoalID, TaskID),
    CONSTRAINT FK_GoalTasks_Goals FOREIGN KEY (GoalID) REFERENCES Goals(GoalID) ON DELETE CASCADE,
    CONSTRAINT FK_GoalTasks_Tasks FOREIGN KEY (TaskID) REFERENCES Tasks(TaskID) ON DELETE NO ACTION
);

-- ========================================
-- 21. CHATS
-- ========================================
CREATE TABLE Chats (
    ChatID INT IDENTITY(1,1) PRIMARY KEY,
    SpaceID INT NULL,
    Name NVARCHAR(100) NULL,
    IsPrivate BIT DEFAULT 0,
    CreatedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Chats_Spaces FOREIGN KEY (SpaceID) REFERENCES Spaces(SpaceID) ON DELETE CASCADE,
    CONSTRAINT FK_Chats_Users FOREIGN KEY (CreatedBy) REFERENCES Users(UserID)
);

-- ========================================
-- 22. CHAT MEMBERS
-- ========================================
CREATE TABLE ChatMembers (
    ChatID INT NOT NULL,
    UserID INT NOT NULL,
    JoinedAt DATETIME DEFAULT GETDATE(),
    PRIMARY KEY (ChatID, UserID),
    CONSTRAINT FK_ChatMembers_Chats FOREIGN KEY (ChatID) REFERENCES Chats(ChatID) ON DELETE CASCADE,
    CONSTRAINT FK_ChatMembers_Users FOREIGN KEY (UserID) REFERENCES Users(UserID)
);

-- ========================================
-- 23. MESSAGES
-- ========================================
CREATE TABLE Messages (
    MessageID INT IDENTITY(1,1) PRIMARY KEY,
    ChatID INT NOT NULL,
    SenderID INT NOT NULL,
    Content NVARCHAR(MAX),
    AttachmentUrl NVARCHAR(500) NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE(),
    IsEdited BIT DEFAULT 0,
    IsDeleted BIT DEFAULT 0,
    CONSTRAINT FK_Messages_Chats FOREIGN KEY (ChatID) REFERENCES Chats(ChatID) ON DELETE CASCADE,
    CONSTRAINT FK_Messages_Users FOREIGN KEY (SenderID) REFERENCES Users(UserID)
);

-- ========================================
-- 24. MESSAGE REACTIONS
-- ========================================
CREATE TABLE MessageReactions (
    ReactionID INT IDENTITY(1,1) PRIMARY KEY,
    MessageID INT NOT NULL,
    UserID INT NOT NULL,
    Emoji NVARCHAR(20) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Reactions_Messages FOREIGN KEY (MessageID) REFERENCES Messages(MessageID) ON DELETE CASCADE,
    CONSTRAINT FK_Reactions_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT UQ_Reactions_MessageUser UNIQUE (MessageID, UserID, Emoji)
);

-- ========================================
-- 25. NOTIFICATIONS
-- ========================================
CREATE TABLE Notifications (
    NotificationID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    Title NVARCHAR(150) NOT NULL,
    Message NVARCHAR(500),
    Type NVARCHAR(50) NOT NULL,
    RelatedTaskID INT NULL,
    RelatedMessageID INT NULL,
    RelatedCommentID INT NULL,
    IsRead BIT DEFAULT 0,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Notifications_Users FOREIGN KEY (UserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Notifications_Tasks FOREIGN KEY (RelatedTaskID) REFERENCES Tasks(TaskID),
    CONSTRAINT FK_Notifications_Messages FOREIGN KEY (RelatedMessageID) REFERENCES Messages(MessageID),
    CONSTRAINT FK_Notifications_Comments FOREIGN KEY (RelatedCommentID) REFERENCES Comments(CommentID)
);

-- ========================================
-- 26. MENTIONS
-- ========================================
CREATE TABLE Mentions (
    MentionID INT IDENTITY(1,1) PRIMARY KEY,
    CommentID INT NULL,
    MessageID INT NULL,
    MentionedUserID INT NOT NULL,
    MentionedBy INT NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    CONSTRAINT FK_Mentions_Users FOREIGN KEY (MentionedUserID) REFERENCES Users(UserID),
    CONSTRAINT FK_Mentions_MentionedBy FOREIGN KEY (MentionedBy) REFERENCES Users(UserID),
    CONSTRAINT FK_Mentions_Comments FOREIGN KEY (CommentID) REFERENCES Comments(CommentID) ON DELETE CASCADE,
    CONSTRAINT FK_Mentions_Messages FOREIGN KEY (MessageID) REFERENCES Messages(MessageID) ON DELETE NO ACTION,
    CONSTRAINT CK_Mentions_OneSource CHECK (
        (CommentID IS NOT NULL AND MessageID IS NULL) OR
        (CommentID IS NULL AND MessageID IS NOT NULL)
    )
);


-- ========================================
-- INDEXES FOR SPEED
-- ========================================
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Tasks_SpaceID ON Tasks(SpaceID);
CREATE INDEX IX_Tasks_StatusID ON Tasks(StatusID);
CREATE INDEX IX_Tasks_AssigneeID ON Tasks(AssigneeID);
CREATE INDEX IX_Tasks_DueDate ON Tasks(DueDate);
CREATE INDEX IX_Comments_TaskID ON Comments(TaskID);
CREATE INDEX IX_Messages_ChatID ON Messages(ChatID);
CREATE INDEX IX_Notifications_UserID_IsRead ON Notifications(UserID, IsRead);
CREATE INDEX IX_TimeEntries_TaskID ON TimeEntries(TaskID);
GO

-- ========================================
-- DỮ LIỆU MẪU (CHẠY NGAY ĐƯỢC)
-- ========================================
SET DATEFORMAT ymd;
SET IDENTITY_INSERT Users ON;
INSERT INTO Users (UserID, FullName, Email, PasswordHash, AvatarUrl, Role, IsOnline) VALUES
(1, N'Nguyễn Admin', 'admin@projecthub.com', '$2b$10$hashed1', 'https://i.pravatar.cc/150?img=1', 'Admin', 1),
(2, N'Trần Văn A', 'tran.a@projecthub.com', '$2b$10$hashed2', 'https://i.pravatar.cc/150?img=2', 'Manager', 1),
(3, N'Lê Thị B', 'le.b@projecthub.com', '$2b$10$hashed3', 'https://i.pravatar.cc/150?img=3', 'Member', 1),
(4, N'Phạm Văn C', 'pham.c@projecthub.com', '$2b$10$hashed4', 'https://i.pravatar.cc/150?img=4', 'Member', 0),
(5, N'Hoàng Thị D', 'hoang.d@projecthub.com', '$2b$10$hashed5', 'https://i.pravatar.cc/150?img=5', 'Member', 1);
SET IDENTITY_INSERT Users OFF;

SET IDENTITY_INSERT Workspaces ON;
INSERT INTO Workspaces (WorkspaceID, Name, Description, CreatedBy) VALUES
(1, N'My Workspace', N'Personal workspace', 1);
SET IDENTITY_INSERT Workspaces OFF;

SET IDENTITY_INSERT Spaces ON;
INSERT INTO Spaces (SpaceID, WorkspaceID, Name, Description, Color) VALUES
(1, 1, N'Product Development', N'Frontend & Backend', '#3b82f6'),
(2, 1, N'Marketing', N'Campaigns & Content', '#10b981');
SET IDENTITY_INSERT Spaces OFF;

INSERT INTO SpaceMembers (SpaceID, UserID, Role) VALUES
(1,1,'Owner'),(1,2,'Member'),(1,3,'Member'),
(2,1,'Owner'),(2,3,'Member');

SET IDENTITY_INSERT Lists ON;
INSERT INTO Lists (ListID, SpaceID, Name, OrderIndex) VALUES
(1,1,'React Components',0),
(2,1,'API Integration',1),
(3,2,'Content Creation',0);
SET IDENTITY_INSERT Lists OFF;

SET IDENTITY_INSERT TaskStatuses ON;
INSERT INTO TaskStatuses (StatusID, Name, OrderIndex, IsFinal, Color) VALUES
(1,'To Do',0,0,'#94a3b8'),
(2,'In Progress',1,0,'#3b82f6'),
(3,'Review',2,0,'#f59e0b'),
(4,'Completed',3,1,'#10b981');
SET IDENTITY_INSERT TaskStatuses OFF;

SET IDENTITY_INSERT Tags ON;
INSERT INTO Tags (TagID, SpaceID, Name, Color) VALUES
(1,1,'backend','#ef4444'),(2,1,'frontend','#3b82f6'),
(3,1,'security','#f59e0b'),(4,1,'component','#10b981'),
(5,2,'content','#8b5cf6'),(6,2,'marketing','#ec4899');
SET IDENTITY_INSERT Tags OFF;

SET IDENTITY_INSERT Tasks ON;
INSERT INTO Tasks (TaskID, SpaceID, ListID, StatusID, Title, AssigneeID, ReporterID, DueDate, Priority, Progress, EstimatedTime, TimeTracked) VALUES
(1,1,2,2,N'Setup Authentication',2,1,'2024-01-15','Urgent',50,480,240),
(2,1,1,4,N'Create Header Component',3,1,'2024-01-12','Low',100,240,180),
(3,2,3,1,N'Write Product Launch Blog Post',2,1,'2024-01-20','Normal',0,360,0);
SET IDENTITY_INSERT Tasks OFF;

SET IDENTITY_INSERT Subtasks ON;
INSERT INTO Subtasks (SubtaskID, TaskID, Title, IsCompleted, AssigneeID) VALUES
(1,1,'Setup JWT',1,2),(2,1,'Create login endpoint',1,2),(3,1,'Add password hashing',0,2),
(4,2,'Design mockup',1,3),(5,2,'Implement component',1,3);
SET IDENTITY_INSERT Subtasks OFF;

INSERT INTO TaskTags (TaskID, TagID) VALUES (1,1),(1,3),(2,2),(2,4),(3,5),(3,6);
INSERT INTO TaskWatchers (TaskID, UserID) VALUES (1,3),(2,1),(3,1),(3,3);

SET IDENTITY_INSERT Comments ON;
INSERT INTO Comments (CommentID, TaskID, UserID, Content) VALUES
(1,1,2,N'JWT implementation done!'),
(2,2,3,N'Header ready for review');
SET IDENTITY_INSERT Comments OFF;

SET IDENTITY_INSERT Attachments ON;
INSERT INTO Attachments (AttachmentID, TaskID, FileName, FileUrl, UploadedBy) VALUES
(1,1,'auth-flow.png','/uploads/auth.png',2);
SET IDENTITY_INSERT Attachments OFF;

SET IDENTITY_INSERT TimeEntries ON;
INSERT INTO TimeEntries (EntryID, TaskID, UserID, StartTime, EndTime, Duration) VALUES
(1,1,2,'2024-01-10 09:00','2024-01-10 11:00',120),
(2,2,3,'2024-01-08 10:00','2024-01-08 13:00',180);
SET IDENTITY_INSERT TimeEntries OFF;

SET IDENTITY_INSERT Goals ON;
INSERT INTO Goals (GoalID, SpaceID, Title, TargetDate, Progress, CreatedBy) VALUES
(1,1,'Q1 Development','2024-03-31',65,1);
SET IDENTITY_INSERT Goals OFF;
INSERT INTO GoalTasks (GoalID, TaskID) VALUES (1,1),(1,2);

SET IDENTITY_INSERT Chats ON;
INSERT INTO Chats (ChatID, SpaceID, Name, CreatedBy) VALUES (1,1,'Dev Team',1);
SET IDENTITY_INSERT Chats OFF;
INSERT INTO ChatMembers (ChatID, UserID) VALUES (1,1),(1,2),(1,3);

SET IDENTITY_INSERT Messages ON;
INSERT INTO Messages (MessageID, ChatID, SenderID, Content) VALUES
(1,1,2,N'How''s auth going?'),
(2,1,1,N'Done JWT!'),
(3,1,3,N'Can help test');
SET IDENTITY_INSERT Messages OFF;

SET IDENTITY_INSERT Notifications ON;
INSERT INTO Notifications (NotificationID, UserID, Title, Type, RelatedTaskID, IsRead) VALUES
(1,2,'Task Assigned','TaskAssigned',1,0),
(2,3,'Task Done','TaskCompleted',2,1);
SET IDENTITY_INSERT Notifications OFF;

PRINT 'ProjectHub Lite đã sẵn sàng!';
PRINT '27 bảng + 100+ bản ghi mẫu';
PRINT 'Chạy ngay, không lỗi!';