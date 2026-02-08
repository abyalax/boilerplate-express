/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: <generic repositories> */
import { MetaResponse } from '~/common/types/meta'
import { CachePort } from './cache'

type CustomOrderBy = {
  [key: string]: 'asc' | 'desc'
}

type SearchMapper<Entity, Where> = {
  [K in keyof Entity]?: (term?: string) => Where
}

export type PaginateOptions<Where, OrderBy, Entity, Include> = {
  page: string | number
  per_page: string | number
  search?: {
    term?: string
    fields: (keyof Entity)[]
    mapper: SearchMapper<Entity, Where>
  }
  where?: Where
  order_by?: OrderBy | CustomOrderBy
  include?: Include
}

export class Repository<
  ModelDelegate extends {
    aggregate: any
    groupBy: any
    count: any

    create: any
    createMany: any
    createManyAndReturn: any

    delete: any
    deleteMany: any

    findFirst: any
    findFirstOrThrow: any
    findMany: any
    findUnique: any
    findUniqueOrThrow: any

    update: any
    updateMany: any
    upsert: any
    fields: any
  },
  Where,
  OrderBy,
> {
  protected model: ModelDelegate
  public cache?: CachePort

  constructor(model: ModelDelegate, cache?: CachePort) {
    this.model = model
    this.cache = cache
  }

  _getModel() {
    return this.model
  }

  async create(clientId: number, data: any) {
    return this.model.create({
      data: {
        ...data,
        user_id: clientId === 0 ? undefined : clientId,
      },
    })
  }

  async createMany(clientId: number, data: any[]) {
    return this.model.createMany({
      data: {
        ...data,
        user_id: clientId,
      },
    })
  }

  async update<E = any>(clientId: number, id: number, data: any): Promise<E> {
    return this.model.update({ where: { id, user_id: clientId }, data })
  }

  async delete(clientId: number, id: number) {
    return this.model.delete({ where: { id, user_id: clientId } })
  }

  async paginate<T, Include>(options: PaginateOptions<Where, OrderBy, T, Include>): Promise<{ items: T[]; meta: MetaResponse }> {
    const page = Number(options.page) || 1
    const per_page = Number(options.per_page) || 10
    const search = options.search
    const orderBy = {}
    let where = options.where ?? {}

    // --- Advanced Search Across Fields ---
    if (search?.term && search.fields?.length) {
      const OR = search.fields.map((field) => search.mapper?.[field]?.(search.term)).filter(Boolean)

      if (OR.length) {
        where = {
          AND: [where, { OR }],
        }
      }
    }

    const total_count = await this.model.count({
      where,
    })

    for (const [key, value] of Object.entries(options.order_by || {})) {
      if (!key || key === 'undefined' || key === 'null') continue
      if (value !== 'asc' && value !== 'desc') continue
      Object.assign(orderBy, { [key]: value })
    }

    const data = await this.model.findMany({
      orderBy,
      where,
      skip: (page - 1) * per_page,
      take: per_page,
      include: options.include,
    })

    const total_pages = Math.ceil(total_count / per_page)

    return {
      items: data,
      meta: {
        page,
        per_page,
        total_count,
        total_pages,
      },
    }
  }
}
