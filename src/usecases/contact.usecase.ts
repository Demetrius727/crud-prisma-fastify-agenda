import { ContactCreate, ContactRepository } from "../interfaces/constacts.interface";
import { UserRepository } from "../interfaces/user.interface";
import { ContactsRepositoryPrisma } from "../repositories/contacts.repository";
import { UserRepositoryPrisma } from "../repositories/user.repository";

class ContactUseCase {
    private contactRepository: ContactRepository;
    private userRepository: UserRepository;
    constructor() {
        this.contactRepository = new ContactsRepositoryPrisma()
        this.userRepository = new UserRepositoryPrisma
    }

    async create({name, email, phone, userEmail}:ContactCreate) {

        //1.email do usuario logado //2.buscar o usuario pelo email
        //2.1se nao existir, retornar erro //2.2se existir, criar o contato
        //3.antes de criar o contato, validar se ele ja existe pelo telefone ou email

        const user = await this.userRepository.findByEmail(userEmail);
        if (!user) {
            throw new Error('User not found');
        }

        const verifyIfExistsContact = await this.contactRepository.findByEmailOrPhone(email, phone);
        if (verifyIfExistsContact) {
            throw new Error('Contact already exists');
        }

        const contact = await this.contactRepository.create({
            email,
            name,
            phone,
            userId: user.id,
        });
      
        return contact;
    }

    async listAllContacts(userEmail: string) {
        const user = await this.userRepository.findByEmail(userEmail);
    
        if (!user) {
          throw new Error('User not found');
        }
    
        const contacts = await this.contactRepository.findAllContacts(user.id);
    
        return contacts;
    }
}

export { ContactUseCase };