-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('IMAGE', 'VIDEO', 'FILE', 'AUDIO');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('online', 'offline');

-- CreateEnum
CREATE TYPE "RequestType" AS ENUM ('pending', 'approved', 'rejected');

-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('private', 'public');

-- CreateEnum
CREATE TYPE "FriendsType" AS ENUM ('friend', 'blocked');

-- CreateEnum
CREATE TYPE "FriendsStatus" AS ENUM ('active', 'removed');

-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('seen', 'unseen');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "fullName" TEXT,
    "status" "UserStatus" NOT NULL DEFAULT 'offline',
    "lastLogin" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "isActivated" BOOLEAN NOT NULL DEFAULT false,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "account" "AccountType" NOT NULL DEFAULT 'public',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "file" TEXT,
    "fileType" "FileType",
    "senderId" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "chatId" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'unseen',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChatRoom" (
    "id" TEXT NOT NULL,
    "userOneId" TEXT NOT NULL,
    "userTwoId" TEXT NOT NULL,

    CONSTRAINT "ChatRoom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Request" (
    "id" TEXT NOT NULL,
    "senderId" TEXT NOT NULL,
    "friendId" TEXT NOT NULL,
    "status" "RequestType" NOT NULL DEFAULT 'pending',
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Friends" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "relatedUserId" TEXT NOT NULL,
    "relationshipType" "FriendsType" NOT NULL,
    "status" "FriendsStatus" NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Friends_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE INDEX "idx_email" ON "User"("email");

-- CreateIndex
CREATE INDEX "idx_username" ON "User"("username");

-- CreateIndex
CREATE INDEX "idx_senderId" ON "Message"("senderId");

-- CreateIndex
CREATE INDEX "idx_receiverId" ON "Message"("receiverId");

-- CreateIndex
CREATE INDEX "idx_chatId" ON "Message"("chatId");

-- CreateIndex
CREATE INDEX "idx_userOneId" ON "ChatRoom"("userOneId");

-- CreateIndex
CREATE INDEX "idx_userTwoId" ON "ChatRoom"("userTwoId");

-- CreateIndex
CREATE UNIQUE INDEX "Request_senderId_friendId_key" ON "Request"("senderId", "friendId");

-- CreateIndex
CREATE UNIQUE INDEX "Friends_userId_relatedUserId_key" ON "Friends"("userId", "relatedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Token_userId_key" ON "Token"("userId");

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "ChatRoom"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_userOneId_fkey" FOREIGN KEY ("userOneId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChatRoom" ADD CONSTRAINT "ChatRoom_userTwoId_fkey" FOREIGN KEY ("userTwoId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Request" ADD CONSTRAINT "Request_friendId_fkey" FOREIGN KEY ("friendId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Friends" ADD CONSTRAINT "Friends_relatedUserId_fkey" FOREIGN KEY ("relatedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD CONSTRAINT "Token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
