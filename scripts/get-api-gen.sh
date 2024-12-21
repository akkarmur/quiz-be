#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <module-name>"
  exit 1
fi

MODULE_NAME=$1
BASE_DIR="../src"

echo "Generating GET API for module: $MODULE_NAME..."

# 1. Controller
CONTROLLER_DIR="${BASE_DIR}/interface/controller/${MODULE_NAME}/get-${MODULE_NAME}"
mkdir -p $CONTROLLER_DIR
cat <<EOF > $CONTROLLER_DIR/get-${MODULE_NAME}.controller.ts
import { Request, Response, NextFunction } from 'express';

export const get${MODULE_NAME^}Controller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const tokenDetails = res.locals.user;
    const { get_all, ...query } = req.query;

    // Determine query conditions and pagination
    let isActive = false;
    if (tokenDetails.role === USER_ROLES.USER) {
      query.id = \`\${tokenDetails.id}\`;
    } else if (get_all !== 'true') {
      query.id = \`\${tokenDetails.id}\`;
    } else {
      isActive = true;
    }

    const paginationData = convertToPagination(query);

    // Fetch data from use case
    const data = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      return await get${MODULE_NAME^}UseCase(paginationData, mysql${MODULE_NAME^}Repo, isActive, t);
    })
    

    handleResult(req, res, next, StatusCodes.OK, '${MODULE_NAME^}_FETCH_SUCCESS', data);
  } catch (error) {
    next(error);
  }
};
EOF

# 2. Use Case
USECASE_DIR="${BASE_DIR}/application/usecase/${MODULE_NAME}/get-${MODULE_NAME}"
mkdir -p $USECASE_DIR
cat <<EOF > $USECASE_DIR/get-${MODULE_NAME}.usecase.ts
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Transaction } from 'sequelize';

export const get${MODULE_NAME^}UseCase = async (
  paginationData: Pagination,
  repo: ${MODULE_NAME^}RepoInterface,
  isActive: boolean,
  t: Transaction
): Promise<E.Either<ApplicationError, ${MODULE_NAME^}GetRes>> => {
  // Get the list of records
  const records = await repo.get(paginationData, t);

  // Get the count of records
  const totalCount = await repo.getCount(paginationData, t);

  // If data is found, format the response
  if (O.isSome(records)) {
    const formattedData = records.value.map((item) =>
      ${MODULE_NAME^}GetResDataFromJSON(item, isActive),
    );
    return E.right({ totalCount, data: formattedData });
  } else {
    // If no data is found, return an error
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'));
  }
};
EOF

# 3. Repository
REPO_DIR="${BASE_DIR}/infrastructure/orm/repositories/mysql-repositories/${MODULE_NAME}"
mkdir -p $REPO_DIR
cat <<EOF > $REPO_DIR/${MODULE_NAME}.repo.ts
import * as O from 'fp-ts/Option';

export const mysql${MODULE_NAME^}Repo: ${MODULE_NAME^}RepoInterface = {
  async get(paginationData: Pagination, t): Promise<O.Option<${MODULE_NAME^}Entity[]>> {
    const { fields, order, limit, offset } = paginationData;
    const where = mysqlCommonRepo.whereCondition(fields);
    const orderBy = mysqlCommonRepo.convertOrder(order);

    const data = await YourModel.findAll({
      where,
      limit,
      offset,
      order: orderBy,
      transaction: t,
    });

    return optionFormatForArray(data);
  },

  async getCount(paginationData: Pagination, t): Promise<number> {
    const where = mysqlCommonRepo.whereCondition(paginationData.fields);
    const count = await YourModel.count({ where, transaction: t });
    return count;
  },

  async insert(data: ${MODULE_NAME^}Entity, t): Promise<${MODULE_NAME^}Entity> {
    return await YourModel.create(data, { transaction: t });
  },

  update: async (input: ${MODULE_NAME^}Entity, t: Transaction): Promise<number> => {
    const [affectedRowCount] = await YourModel.update(input, {
      where: {
        id: input.id,
      },
      transaction: t,
    })
    return affectedRowCount
  },

  delete: async (input: ${MODULE_NAME^}DeleteInput, t: Transaction): Promise<void> => {
    await YourModel.update(
      { is_active: input.is_active },
      {
        where: {
          id: input.id,
        },
        transaction: t,
      },
    )
  },
};
EOF

cat <<EOF > $REPO_DIR/${MODULE_NAME}-repo.interface.ts
import * as O from 'fp-ts/Option';

export interface ${MODULE_NAME^}RepoInterface {
  get(paginationData: Pagination, t: Transaction): Promise<O.Option<${MODULE_NAME^}Entity[]>>;
  getCount(paginationData: Pagination, t: Transaction): Promise<number>;
  insert(data: ${MODULE_NAME^}Entity, t: Transaction): Promise<${MODULE_NAME^}Entity>;
  update(data: ${MODULE_NAME^}Entity, t: Transaction): Promise<number>;
  delete(input: ${MODULE_NAME^}DeleteInput, t: Transaction): Promise<void>;
}
EOF

# 4. Validation
VALIDATION_DIR="${BASE_DIR}/interface/validation/${MODULE_NAME}"
mkdir -p $VALIDATION_DIR
cat <<EOF > $VALIDATION_DIR/get-${MODULE_NAME}.validation.ts
import * as Joi from 'joi';

/**
 * Validation schema for fetching ${MODULE_NAME^}.
 * This schema includes pagination, filtering, and optional flags.
 */

export const get${MODULE_NAME^}Schema = Joi.object({
  name: Joi.string().pattern(searchStringValidation()),
  created_at: Joi.date(),
  updated_at: Joi.date(),
  get_all: Joi.string().valid('true', 'false'),
  ...commonPaginationSchema,
})
EOF


# 5. Entity
ENTITY_DIR="${BASE_DIR}/domain/entities/${MODULE_NAME}/get"
mkdir -p $ENTITY_DIR
cat <<EOF > $ENTITY_DIR/${MODULE_NAME}.interface.ts
export interface ${MODULE_NAME^}Entity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ${MODULE_NAME^}GetRes {
  totalCount: number;
  data: ${MODULE_NAME^}Entity[];
}
EOF

echo "GET API for module $MODULE_NAME generated successfully!"
