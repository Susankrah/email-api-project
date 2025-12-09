import {Injectable, ConflictException, NotFoundException} from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {User} from './users.entity';
import {CreateUserDto} from './dto/create-user.dto';
import {UserResponseDto} from './dto/user-response.dto';



@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private  userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {  
        const existingUser = await this.userRepository.findOne({
            where: { email: createUserDto.email },  
        });
        
        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const user = this.userRepository.create(createUserDto);
        const savedUser = await this.userRepository.save(user);

       return {
        id: savedUser.id,
        email: savedUser.email,
        name: savedUser.name,
        createdAt: savedUser.createdAt,
        updatedAt: savedUser.updatedAt,
       };
    }

    async findAll(): Promise<UserResponseDto[]> {
        const users = await this.userRepository.find({
            order: { createdAt: 'DESC'}
        });
        return users.map(user => ({
            id: user.id,
            email: user.email,
            name: user.name,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
    }

    async findOne(id: string): Promise<User> {
        const user = await this.userRepository.findOne({ where: { id } });

        if (!user) {
            throw new NotFoundException(`User with ID not found`);
        }
        return user;
    }
}
