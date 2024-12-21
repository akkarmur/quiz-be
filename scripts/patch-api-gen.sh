#!/bin/bash

if [ -z "$1" ]; then
  echo "Usage: $0 <module-name>"
  exit 1
fi

MODULE_NAME=$1
BASE_DIR="../src"

echo "Generating UPDATE API for module: $MODULE_NAME..."

# 1. Controller
CONTROLLER_DIR="${BASE_DIR}/interface/controller/${MODULE_NAME}/update-${MODULE_NAME}"
mkdir -p $CONTROLLER_DIR
cat <<EOF > $CONTROLLER_DIR/update-${MODULE_NAME}.controller.ts
import { Request, Response, NextFunction } from 'express';

export const update${MODULE_NAME^}Controller = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await mysqlCommonRepo.wrapInWorkUnitCtx(async (t) => {
      await update${MODULE_NAME^}UseCase(req.body, mysql${MODULE_NAME^}Repo, t);
    })
    handleResult(req, res, next, StatusCodes.OK, 'OK', result);
  } catch (error) {
    next(error);
  }
};
EOF

# 2. Use Case
USECASE_DIR="${BASE_DIR}/application/usecase/${MODULE_NAME}/update-${MODULE_NAME}"
mkdir -p $USECASE_DIR
cat <<EOF > $USECASE_DIR/update-${MODULE_NAME}.usecase.ts
import * as E from 'fp-ts/Either';
import * as O from 'fp-ts/Option';
import { Transaction } from 'sequelize';

export const update${MODULE_NAME^}UseCase = async (
  data: ${MODULE_NAME^}Entity,
  repo: ${MODULE_NAME^}RepoInterface,
  t: Transaction
): Promise<E.Either<ApplicationError, void>> => {
  const affectedRowCount = await repo.update(data, t)

  /**
   * If no rows are affected, return an error indicating no input was found
   */
  if (!affectedRowCount) {
    return E.left(formatError(StatusCodes.NOT_FOUND, 'NO_DATA_FOUND'))
  }
};

  // update new record
  const updateedRecord = await repo.update(data, t);
  return E.right(updateedRecord);
};
EOF

# 4. Validation
VALIDATION_DIR="${BASE_DIR}/interface/validation/${MODULE_NAME}/patch"
mkdir -p $VALIDATION_DIR
cat <<EOF > $VALIDATION_DIR/update-${MODULE_NAME}.validation.ts
import * as Joi from 'joi';

export const update${MODULE_NAME^}Schema = Joi.object({
  id: Joi.string().required().description('${MODULE_NAME^} ID'),
  name: Joi.string().optional().description('${MODULE_NAME^} name'),
  createdAt: Joi.date().optional(),
  updatedAt: Joi.date().optional(),
});
EOF

# 5. Entity
ENTITY_DIR="${BASE_DIR}/domain/entities/${MODULE_NAME}"
mkdir -p $ENTITY_DIR
cat <<EOF > $ENTITY_DIR/${MODULE_NAME}.interface.ts
export interface ${MODULE_NAME^}Entity {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
EOF

echo "update API for module $MODULE_NAME generated successfully!"
