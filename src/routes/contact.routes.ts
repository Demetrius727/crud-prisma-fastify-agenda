import { FastifyInstance } from "fastify";
import { ContactCreate } from "../interfaces/constacts.interface";
import { ContactUseCase } from "../usecases/contact.usecase";
import { authMiddleware } from "../middlewares/auth.middleware";

export async function contactsRoutes(fastify: FastifyInstance) {
    const contactUseCase = new ContactUseCase()
    fastify.addHook('preHandler', authMiddleware);
    fastify.post<{Body: ContactCreate}>('/', async (req, reply) => {
        const {name, email, phone} = req.body
        const emailUser = req.headers['email']
        try {
            const data = await contactUseCase.create({
                name,
                email,
                phone,
                userEmail: emailUser,               
            });
            return reply.send(data);
        } catch (error) {
            reply.send(error)
        }
    });
    fastify.get('/', async (req, reply) => {
        const emailUser = req.headers['email'];
        try {
            const data = await contactUseCase.listAllContacts(emailUser);
            return reply.send(data);
        } catch (error) {
            reply.send(error);
        }
    });
}