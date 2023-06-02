import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { GetUserProfileUseCase } from './get-user-profile'
import { hash } from 'bcryptjs'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let usersRepository: InMemoryUsersRepository
let sut: GetUserProfileUseCase

describe('Get User Profile Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const userName = 'Jhon Doe'

    const createdUser = await usersRepository.create({
      name: userName,
      email: 'jhonDoe@example.com',
      password_hash: await hash('123456', 6),
    })

    const { user } = await sut.execute({
      userId: createdUser.id,
    })

    expect(user.name).toEqual(userName)
  })

  it('should be not able to get user profile with wrong id', async () => {
    expect(
      async () =>
        await sut.execute({
          userId: 'non-existing-id',
        }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
