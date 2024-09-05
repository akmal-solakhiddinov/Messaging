const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()

class RequestService {

    async friend(senderId, friendId) {
        try {
            const request = await prisma.request.create({ data: { senderId, friendId } })

            if (!request) throw new Error('Something went wrong wile sending request to friend')

            return { request }
        } catch (error) {
            throw error
        }
    }

    async friendRequestStatus(requestId, status) {
        try {
            console.log(requestId, status, '< --- request');
            const request = await prisma.request.update({
                where: { id: requestId },
                data: { status }
            });

            if (!request) {
                throw new Error(`Something went wrong while ${status} friend request`);
            }

            return { request };
        } catch (error) {
            console.error('Error updating friend request status:', error.message);
            throw new Error('Failed to update friend request status');
        }
    }

    /*     async friendReject(requestId) {
            try {
                const request = await prisma.request.update({ where: { id: requestId }, data: { status: 'approved' } })
    
                if (!request) throw new Error('Something went wrong wile approving  friend request ')
    
                return { request }
            } catch (error) {
    
            }
        }
     */

    async friendRequestAll(userId) {
        try {
            // { senderId: userId },
            const requests = await prisma.request.findMany({
                where: {
                    OR: [
                        { friendId: userId }
                    ]
                },
                include: {
                    sender: {
                        select: {
                            email: true,
                            fullName: true,
                            image: true,
                            account: true,
                            status: true,
                            username: true,
                            lastLogin: true,
                        }
                    }
                }
            })

            if (!requests) throw new Error(`Something went wrong while retriving requests from database`)

            return { requests }
        } catch (error) {
            throw error
        }
    }

    async deleteRequest(userId) {
        try {
            // Fetch all friend requests associated with the userId
            const { requests } = await this.friendRequestAll(userId);

            // Check if there are no requests and exit if none found
            if (!requests || requests.length === 0) {
                // Early return when there's nothing to delete
                return;
            }

            // Map request IDs to an array
            const requestsID = requests.map(req => req.id);

            // Delete the requests using the 'in' clause to match multiple IDs
            const deletedRequests = await prisma.request.deleteMany({
                where: { id: { in: requestsID } }
            });

            // Check if any requests were deleted, return early if none were deleted
            if (deletedRequests.count === 0) {
                // Optional logging, return early without affecting other functions
                console.log(`No requests were deleted for user: ${userId}`);
                return;
            }

            // Return deleted request count if needed
            return deletedRequests;
        } catch (error) {
            throw error; // Propagate unexpected errors
        }
    }



}

module.exports = new RequestService()