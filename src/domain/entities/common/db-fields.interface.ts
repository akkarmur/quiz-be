export type IdAndCreateAndUpdateAtBy<
  T extends {
    id?: number
    created_at?: Date
    updated_at?: Date
    created_by?: string
    updated_by?: string
  },
> = {
  id?: T['id']
  created_at?: T['created_at']
  updated_at?: T['updated_at']
  created_by?: T['created_by']
  updated_by?: T['updated_by']
}
