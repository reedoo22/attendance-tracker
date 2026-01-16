CREATE TABLE `attendanceRecords` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`attendanceDate` date NOT NULL,
	`status` enum('P','D/O','A','L','E','V','AL','S/L','E/L','U/L','OFF') NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `attendanceRecords_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `employees` (
	`id` int AUTO_INCREMENT NOT NULL,
	`name` varchar(255) NOT NULL,
	`position` enum('مشرف','م/مشرف','فرد') NOT NULL,
	`email` varchar(320),
	`phone` varchar(20),
	`isActive` int NOT NULL DEFAULT 1,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `employees_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `leaves` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`leaveType` enum('AL','S/L','E/L','U/L') NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	`reason` text,
	`status` enum('pending','approved','rejected') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `leaves_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `statistics` (
	`id` int AUTO_INCREMENT NOT NULL,
	`employeeId` int NOT NULL,
	`month` varchar(7) NOT NULL,
	`presentDays` int NOT NULL DEFAULT 0,
	`absentDays` int NOT NULL DEFAULT 0,
	`lateDays` int NOT NULL DEFAULT 0,
	`earlyLeaveDays` int NOT NULL DEFAULT 0,
	`violations` int NOT NULL DEFAULT 0,
	`totalLeaveDays` int NOT NULL DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `statistics_id` PRIMARY KEY(`id`)
);
