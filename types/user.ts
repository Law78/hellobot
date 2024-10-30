import { z } from 'zod'

export const schema = z.object({
  id: z.string(),
  name: z.string(),
  surname: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
  role: z.string(),
})

type User = z.infer<typeof schema>

export default User
