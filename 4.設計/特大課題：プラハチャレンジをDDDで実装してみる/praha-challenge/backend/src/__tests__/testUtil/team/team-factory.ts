import * as faker from 'faker'
import { Team } from 'src/domain/team/team'
import { User } from 'src/domain/user/user'
import { TeamId } from 'src/domain/team/team-id'
import { createUser } from '@testUtil/user/user-factory'

export const createTeam = (params: {
  id?: string
  name?: string
  users?: User[]
}) => {
  let { name, users } = params
  const id = params.id ?? faker.random.uuid()
  name = name ?? `${faker.random.number(999)}`
  users = users ?? [createUser({}), createUser({}), createUser({})]
  return Team.createFromRepository({ id: new TeamId(id), name, users })
}
